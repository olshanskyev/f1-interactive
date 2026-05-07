/**
 * VK Token Interceptor
 *
 * Intercepts responses from the VK API proxy. If an error code 5 (User authorization failed)
 * is detected, it attempts to refresh the token.
 *
 * Uses a single shared `refreshInFlight$` observable (via `shareReplay`) so that:
 * - Only one refresh call is made regardless of how many requests fail simultaneously.
 * - `shareReplay` without `refCount` keeps the refresh alive even if downstream
 *   subscribers (e.g. widgets using switchMap/combineLatest) unsubscribe mid-flight.
 * - Late subscribers (queued requests) receive the cached result immediately.
 */
import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../authentication/auth.service';
import { TokenService } from '../authentication/token.service';
import { Observable, of } from 'rxjs';
import { catchError, mergeMap, shareReplay, switchMap, take, tap } from 'rxjs/operators';

let refreshInFlight$: Observable<boolean> | null = null;

export function vkTokenInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn)
        : Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);

  if (!req.url.includes('/vkproxy')) {
    return next(req);
  }

  return next(req).pipe(
    mergeMap((event: HttpEvent<any>) => {
      if (!(event instanceof HttpResponse) || event.body?.error?.error_code !== 5) {
        return of(event);
      }

      // Start a shared refresh if one isn't already in progress
      if (!refreshInFlight$) {
        if (!tokenService.valid() && tokenService.getRefreshToken()) {
          refreshInFlight$ = authService.refresh().pipe(
            take(1),
            catchError(() => of(false)),
            tap({
              next: success => { if (!success) tokenService.clear(); },
              complete: () => { refreshInFlight$ = null; }
            }),
            shareReplay(1)
          );
        } else {
          return of(event);
        }
      }

      // All concurrent requests share the same refresh result and retry on success
      return refreshInFlight$.pipe(
        switchMap(success => {
          if (success) {
            return next(updateRequestToken(req, tokenService.getAccessToken() || ''));
          }
          return of(event);
        })
      );
    })
  );
}

function updateRequestToken(req: HttpRequest<unknown>, newToken: string): HttpRequest<unknown> {
  if (req.params.has('access_token')) {
    return req.clone({ params: req.params.set('access_token', newToken) });
  } else if (req.url.includes('access_token=')) {
    return req.clone({ url: req.url.replace(/access_token=[^&]*/, `access_token=${newToken}`) });
  } else if (req.urlWithParams.includes('access_token=')) {
    return req.clone({ url: req.urlWithParams.replace(/access_token=[^&]*/, `access_token=${newToken}`) });
  }
  return req;
}

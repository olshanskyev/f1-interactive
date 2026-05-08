/**
 * VK Token Interceptor
 *
 * Intercepts responses from the VK API proxy. If an error code 5 (User authorization failed)
 * is detected, it delegates to AuthService.refresh() which ensures only one refresh call
 * is in flight at a time via shareReplay.
 */
import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../authentication/auth.service';
import { TokenService } from '../authentication/token.service';
import { Observable, of } from 'rxjs';
import { mergeMap, switchMap } from 'rxjs/operators';

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

      if (tokenService.valid() || !tokenService.getRefreshToken()) {
        return of(event);
      }
      return authService.refresh().pipe(
        switchMap(success => {
          if (success) {
            return next(updateRequestToken(req, tokenService.getAccessToken() || ''));
          }
          tokenService.clear();
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

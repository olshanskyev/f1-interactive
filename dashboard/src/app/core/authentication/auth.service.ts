import { Injectable, computed, inject, signal } from '@angular/core';
import { BehaviorSubject, Observable, catchError, iif, map, merge, of, share, shareReplay, switchMap, take, tap } from 'rxjs';
import { filterObject, isEmptyObject } from './helpers';
import { Token, User } from './interface';
import { LoginService } from './login.service';
import { TokenService } from './token.service';
import { VKService } from '@core/services';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly loginService = inject(LoginService);
  private readonly tokenService = inject(TokenService);
  private readonly vkService = inject(VKService);
  private readonly router = inject(Router);
  private refreshInFlight$: Observable<boolean> | null = null;
  private user$ = new BehaviorSubject<User>({});
  private change$ = merge(
    this.tokenService.change(),
    this.tokenService.refresh().pipe(switchMap(() => this.refresh()))
  ).pipe(
    switchMap(() => this.assignUser()),
    share()
  );

  private readonly _isLoggedIn = signal(this.check());
  public readonly isLoggedIn = this._isLoggedIn.asReadonly();
  public readonly isVkLoggedIn = computed(() => this._isLoggedIn() && this.tokenService.getAuthSystem() === 'vk');

  constructor() {
    this.vkService.onLoginSuccess((token) => this.vkLoggedIn(token));
  }

  change() {
    return this.change$;
  }

  check() {
    return this.tokenService.valid();
  }

  login(username: string, password: string, rememberMe = false) {
    return this.loginService.login(username, password, rememberMe).pipe(
      tap(token => this.tokenService.set(token)),
      map(() => this.check())
    );
  }

  vkLoggedIn(token: Token) {
    this.tokenService.set(token);
    this.router.navigateByUrl('/');
  }

  refresh(): Observable<boolean> {
    if (this.refreshInFlight$) {
      return this.refreshInFlight$;
    }

    const refreshToken = this.tokenService.getRefreshToken();
    const source = (this.tokenService.getAuthSystem() === 'vk')?
      this.vkService.refresh():
      this.loginService.refresh(filterObject({ refresh_token: refreshToken }));

    this.refreshInFlight$ = source.pipe(
      take(1),
      catchError(() => of(undefined)),
      tap(token => this.tokenService.set(token)),
      map(() => this.check()),
      tap({ complete: () => this.refreshInFlight$ = null }),
      shareReplay(1)
    );

    return this.refreshInFlight$;
  }

  logout() {
    const source = (this.tokenService.getAuthSystem() === 'vk')?
      this.vkService.logout():
      this.loginService.logout();
    return source.pipe(
      catchError(() => of(null)),
      tap(() => this.tokenService.clear()),
      map(() => !this.check())
    );
  }

  user() {
    return this.user$.pipe(share());
  }

  menu() {
    return iif(() => this.check(), this.loginService.menu(), this.loginService.defaultMenu());
  }

  private refreshOnceAndCall(fn: () => Observable<any>): Observable<any> {
    return this.refresh().pipe(
      switchMap(success => {
        if (success) {
          return fn();
        }
        this.tokenService.clear();
        return of({});
      })
    );
  }

  private assignUser() {
    this._isLoggedIn.set(this.check());
    if (!this.check()) {
      return of({}).pipe(tap(user => this.user$.next(user)));
    }

    if (!isEmptyObject(this.user$.getValue())) {
      return of(this.user$.getValue());
    }

    const getUserSource = () => (this.tokenService.getAuthSystem() === 'vk')?
      this.vkService.userInfo():
      this.loginService.user();

    return getUserSource().pipe(
      catchError((err) => {
        if (err?.error === 'invalid_token') {
          return this.refreshOnceAndCall(getUserSource);
        }
        return of({});
      }),
      tap(user => this.user$.next(user))
    );

  }
}

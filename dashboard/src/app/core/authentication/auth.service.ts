import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, catchError, iif, map, merge, Observable, of, share, switchMap, tap } from 'rxjs';
import { filterObject, isEmptyObject } from './helpers';
import { Token, User } from './interface';
import { LoginService } from './login.service';
import { TokenService } from './token.service';
import { VKService } from '@core/services';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly loginService = inject(LoginService);
  private readonly tokenService = inject(TokenService);
  private readonly vkService = inject(VKService);

  private user$ = new BehaviorSubject<User>({});
  private change$ = merge(
    this.tokenService.change(),
    this.tokenService.refresh().pipe(switchMap(() => this.refresh()))
  ).pipe(
    switchMap(() => this.assignUser()),
    share()
  );

  constructor() {
    this.vkService.onLoginSuccess((token) => this.vkLoggedIn(token))
  }

  init() {
    return new Promise<void>(resolve => this.change$.subscribe(() => resolve()));
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
  }

  refresh() {
    const refreshToken = this.tokenService.getRefreshToken();
    const source = (this.tokenService.getAuthSystem() === 'vk')?
      this.vkService.refresh():
      this.loginService.refresh(filterObject({ refresh_token: refreshToken }));

    return source.pipe(
      catchError(() => of(undefined)),
      tap(token => this.tokenService.set(token)),
      map(() => this.check())
    );
  }

  logout() {
    const source = (this.tokenService.getAuthSystem() === 'vk')?
      this.vkService.logout():
      this.loginService.logout();
    return source.pipe(
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

  private assignUser() {
    if (!this.check()) {
      return of({}).pipe(tap(user => this.user$.next(user)));
    }

    if (!isEmptyObject(this.user$.getValue())) {
      return of(this.user$.getValue());
    }

    const source = (this.tokenService.getAuthSystem() === 'vk')?
      this.vkService.userInfo():
      this.loginService.user();
    return source.pipe(tap(user => this.user$.next(user)));

  }
}

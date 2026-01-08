import { HttpRequest, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { AuthService, LoginService, TokenService, User } from '@core/authentication';
import { LocalStorageService, MemoryStorageService } from '@shared/services/storage.service';
import { Observable, skip } from 'rxjs';
import { NgxRolesService } from 'ngx-permissions';

describe('AuthService', () => {
  let authService: AuthService;
  let loginService: LoginService;
  let tokenService: TokenService;
  let httpMock: HttpTestingController;
  let mockRolesService: NgxRolesService;
  let user$: Observable<User>;
  const email = 'foo@bar.com';
  const token = { access_token: 'token', token_type: 'bearer' };
  const user = { id: 1, email };
  vi.useFakeTimers();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: LocalStorageService, useClass: MemoryStorageService ,
        },
        {
          provide: NgxRolesService,
          useValue: {
            getRole: (name: string) => void 0
          },
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    loginService = TestBed.inject(LoginService);
    authService = TestBed.inject(AuthService);
    tokenService = TestBed.inject(TokenService);
    httpMock = TestBed.inject(HttpTestingController);
    mockRolesService = TestBed.inject(NgxRolesService);

    user$ = authService.user();
    authService.change().subscribe(user => {
      expect(user).toBeInstanceOf(Object);
    });

  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should log in failed', () => {
    authService.login(email, 'password', false).subscribe(isLogin => expect(isLogin).toBe(false));
    httpMock.expectOne('/auth/login').flush({});

    expect(authService.check()).toBe(false);
  });

  it('should log in successful and get user info', () => {
    user$.pipe(skip(1)).subscribe(currentUser => expect(currentUser.id).toEqual(user.id));
    authService.login(email, 'password', false).subscribe(isLogin => expect(isLogin).toBe(true));
    httpMock.expectOne('/auth/login').flush(token);

    expect(authService.check()).toBe(true);
    httpMock.expectOne('/user').flush(user);
  });

  it('should log out failed when user is not login', () => {
    vi.spyOn(loginService, 'logout');
    expect(authService.check()).toBe(false);

    authService.logout().subscribe();
    httpMock.expectOne('/auth/logout');

    expect(authService.check()).toBe(false);
    expect(loginService.logout).toHaveBeenCalled();
  });

  it('should log out successful when user is login', () => {
    tokenService.set(token);
    expect(authService.check()).toBe(true);
    httpMock.expectOne('/user').flush(user);

    user$.pipe(skip(1)).subscribe(currentUser => expect(currentUser.id).toBeUndefined());
    authService.logout().subscribe();
    httpMock.expectOne('/auth/logout').flush({});

    expect(authService.check()).toBe(false);
  });

  it('should refresh token when access_token is valid', () => {
    tokenService.set(Object.assign({ expires_in: 5 }, token));
    expect(authService.check()).toBe(true);
    httpMock.expectOne('/user').flush(user);
    const match = (req: HttpRequest<any>) => req.url === '/auth/refresh' && !req.body.refresh_token;

    vi.advanceTimersByTime(4000);
    expect(authService.check()).toBe(true);
    httpMock.match(match)[0].flush(token);

    expect(authService.check()).toBe(true);
    httpMock.expectNone('/user');
    tokenService.ngOnDestroy();
  });

  it('should refresh token when access_token is invalid and refresh_token is valid', () => {
    tokenService.set(Object.assign({ expires_in: 5, refresh_token: 'foo' }, token));
    const match = (req: HttpRequest<any>) =>
      req.url === '/auth/refresh' && req.body.refresh_token === 'foo';

    expect(authService.check()).toBe(true);
    httpMock.expectOne('/user').flush(user);
    vi.advanceTimersByTime(10000);
    expect(authService.check()).toBe(false);
    httpMock.match(match)[0].flush(token);

    expect(authService.check()).toBe(true);
    httpMock.expectNone('/user');
    tokenService.ngOnDestroy();
  });

  it('it should clear token when access_token is invalid and refresh token response is 401', () => {
    vi.spyOn(tokenService, 'set');
    tokenService.set(Object.assign({ expires_in: 5, refresh_token: 'foo' }, token));
    const match = (req: HttpRequest<any>) =>
      req.url === '/auth/refresh' && req.body.refresh_token === 'foo';

    vi.advanceTimersByTime(10000);
    expect(authService.check()).toBe(false);
    httpMock.expectOne('/user').flush({});
    httpMock.match(match)[0].flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(authService.check()).toBe(false);
    expect(tokenService.set).toHaveBeenCalledWith(undefined);
    tokenService.ngOnDestroy();
  });

  it('it only call http request once when on change subscribe twice', () => {
    authService.change().subscribe();
    tokenService.set(token);
    httpMock.expectOne('/user').flush({});
  });
});

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { Router, provideRouter } from '@angular/router';
import { AuthService, TokenService, adminGuard } from '@core/authentication';
import { LocalStorageService, MemoryStorageService } from '@shared/services/storage.service';
import { NgxRolesService } from 'ngx-permissions';

@Component({
  template: '',
  imports: [],
  providers: [provideHttpClientTesting()],
})
class Dummy {}

describe('authGuard function unit test', () => {
  const route: any = {};
  const state: any = {};
  let router: Router;
  let authService: AuthService;
  let tokenService: TokenService;
  let rolesService: NgxRolesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Dummy],
      providers: [
        { provide: LocalStorageService, useClass: MemoryStorageService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideRouter([
          { path: 'dashboard', component: Dummy, canActivate: [adminGuard] },
          { path: 'auth/login', component: Dummy },
        ]),
        {
          provide: NgxRolesService,
          useValue: {
            getRole: (name: string) => void 0,
          },
        },
      ],
    });
    TestBed.createComponent(Dummy);
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
    tokenService = TestBed.inject(TokenService);
    rolesService = TestBed.inject(NgxRolesService)
  });

  it('should be created', () => {
    expect(adminGuard).toBeTruthy();
  });

  it('should be authenticated with ADMIN role', () => {
    TestBed.runInInjectionContext(() => {
      tokenService.set({ access_token: 'token', token_type: 'bearer' });
      vi.spyOn(rolesService, 'getRole').mockReturnValue({name: 'ADMIN', validationFunction:['*']});
      expect(adminGuard(route, state)).toBe(true);
    });
  });

  it('should redirected to /auth/login because does not have ADMIN role', () => {
    TestBed.runInInjectionContext(() => {
      tokenService.set({ access_token: 'token', token_type: 'bearer' });
      vi.spyOn(rolesService, 'getRole').mockReturnValue(undefined);
      expect(adminGuard(route, state)).toEqual(router.parseUrl('/auth/login'));
    });
  });

  it('should redirect to /auth/login when authenticate failed', () => {
    TestBed.runInInjectionContext(() => {
      vi.spyOn(authService, 'check').mockReturnValue(false);
      expect(adminGuard(route, state)).toEqual(router.parseUrl('/auth/login'));
    });
  });
});

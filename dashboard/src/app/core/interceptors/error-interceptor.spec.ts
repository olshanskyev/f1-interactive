import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { errorInterceptor } from './error-interceptor';
import { describe, beforeEach, afterEach, it, vi, expect } from 'vitest';

describe('ErrorInterceptor', () => {
  let httpMock: HttpTestingController;
  let http: HttpClient;
  let router: Router;
  const emptyFn = () => {};

  function assertStatus(status: number, statusText: string) {
    vi.spyOn(router, 'navigateByUrl');

    http.get('/user').subscribe({ next: emptyFn, error: emptyFn, complete: emptyFn });

    httpMock.expectOne('/user').flush({}, { status, statusText });

    expect(router.navigateByUrl).toHaveBeenCalledWith(`/${status}`, {
      skipLocationChange: true,
    });
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
    router = TestBed.inject(Router);
  });

  afterEach(() => httpMock.verify());

  it('should handle status code 401', () => {
    vi.spyOn(router, 'navigateByUrl');
    vi.spyOn(console, 'log');

    http.get('/user').subscribe({ next: emptyFn, error: emptyFn, complete: emptyFn });
    httpMock.expectOne('/user').flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(console.log).toHaveBeenCalledWith('401 Unauthorized');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/auth/login');
  });

  it('should handle status code 403', () => {
    assertStatus(403, 'Forbidden');
  });

  it('should handle status code 500', () => {
    assertStatus(500, 'Internal Server Error');
  });

  it('should handle others status code', () => {
    vi.spyOn(console, 'log');

    http.get('/user').subscribe({ next: emptyFn, error: emptyFn, complete: emptyFn });

    httpMock.expectOne('/user').flush({}, { status: 504, statusText: 'Gateway Timeout' });

    expect(console.log).toHaveBeenCalledWith('504 Gateway Timeout');
  });
});

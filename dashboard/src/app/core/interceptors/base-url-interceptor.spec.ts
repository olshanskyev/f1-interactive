import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { describe, beforeEach, afterEach, it, expect } from 'vitest';

import { BASE_URL, BASE_URL_SIMULATOR, baseUrlInterceptor } from './base-url-interceptor';

describe('BaseUrlInterceptor', () => {
  let httpMock: HttpTestingController;
  let http: HttpClient;
  const baseUrl = 'https://foo.bar';

  const setBaseUrl = (url: string | null) => {
    TestBed.overrideProvider(BASE_URL, { useValue: url });
    httpMock = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
  };

  const setSimulatorBaseUrl = (url: string | null) => {
    TestBed.overrideProvider(BASE_URL_SIMULATOR, { useValue: url });
    httpMock = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: BASE_URL, useValue: null },
        { provide: BASE_URL_SIMULATOR, useValue: null },
        provideHttpClient(withInterceptors([baseUrlInterceptor])),
        provideHttpClientTesting(),
      ],
    });
  });

  afterEach(() => httpMock.verify());

  it('should not prepend base url when base url is empty', () => {
    setBaseUrl(null);

    http.get('/user').subscribe(data => expect(data).toEqual({ success: true }));

    httpMock.expectOne('/user').flush({ success: true });
  });

  it('should prepend base url when request url does not has http scheme', () => {
    setBaseUrl(baseUrl);

    http.get('./user').subscribe(data => expect(data).toEqual({ success: true }));
    httpMock.expectOne(baseUrl + '/user').flush({ success: true });

    http.get('').subscribe(data => expect(data).toEqual({ success: true }));
    httpMock.expectOne(baseUrl).flush({ success: true });
  });

  it('should prepend simulator bse url when request url has simulator in request', () => {
    setSimulatorBaseUrl(baseUrl);

    http.get('/simulator/start').subscribe(data => expect(data).toEqual({ success: true }));
    httpMock.expectOne(baseUrl + '/simulator/start').flush({ success: true });

  });
});

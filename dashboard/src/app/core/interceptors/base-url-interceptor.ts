import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { InjectionToken, inject } from '@angular/core';

export const BASE_URL = new InjectionToken<string>('BASE_URL');
export const BASE_URL_SIMULATOR = new InjectionToken<string>('BASE_URL_SIMULATOR');

export function hasHttpScheme(url: string) {
  return new RegExp('^http(s)?://', 'i').test(url);
}

export function baseUrlInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  if (req.url.includes('.json')) // loading local sources
    return next(req);
  const baseUrl = inject(BASE_URL, { optional: true });
  const baseUrlSimulator = inject(BASE_URL_SIMULATOR, { optional: true });
  const base = (req.url.includes('simulator'))? baseUrlSimulator: baseUrl;

  const hasScheme = (url: string) => base && hasHttpScheme(url);

  const prependBaseUrl = (url: string) =>
    [base?.replace(/\/$/g, ''), url.replace(/^\.?\//, '')].filter(val => val).join('/');

  return hasScheme(req.url) === false
    ? next(req.clone({ url: prependBaseUrl(req.url) }))
    : next(req);
}

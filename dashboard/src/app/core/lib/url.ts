import { HttpRequest } from '@angular/common/http';

export function isVkProxyRequest(req: HttpRequest<unknown>): boolean {
    return req.url.includes('/vkproxy');
}
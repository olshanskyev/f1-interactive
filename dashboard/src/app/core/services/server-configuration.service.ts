import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ServerConfigurationService {
    protected readonly http = inject(HttpClient);
    public setLiveToken(liveToken: string) {
        return this.http.post<any>('/admin/live_token', { liveToken });
    }

    public getVersion() {
        return this.http.get<{version: string}>('/admin/version');
    }

    public syncLiveData() {
        return this.http.post<any>('/admin/sync_live_data', null);
    }
}
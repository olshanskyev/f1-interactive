import { inject, Injectable, signal } from '@angular/core';
import { SettingsService } from '@core';

@Injectable({ providedIn: 'root' })
export class WakeLockService {

    private readonly settingsService = inject(SettingsService);
    private wakeLock: any = null;
    private _isActive = signal<boolean>(false);
    public isActive = this._isActive.asReadonly();

    private shouldRecover = false;
    private useLock = this.settingsService.getUseLock(); // ToDo make it configurable

    constructor() {
        document.addEventListener('visibilitychange', () => {
        if (this.shouldRecover && document.visibilityState === 'visible') {
            setTimeout(() => this.requestWakeLock(), 100);
        }
        });
    }

    requestWakeLock() {
        if (!this.useLock) return;
        if (document.visibilityState !== 'visible') return;
        if (!('wakeLock' in navigator)) return;

        (navigator as any).wakeLock.request('screen')
        .then((lock: any) => {
            this.wakeLock = lock;
            this._isActive.set(true);
            this.shouldRecover = true;
            this.wakeLock.onrelease = () => {
                this._isActive.set(false);
                this.wakeLock = null;
            };
        })
        .catch((err: any) => {
            this._isActive.set(false);
            if (err.name !== 'NotAllowedError') {
                this.shouldRecover = false;
                console.error('Wake Lock request failed', err);
            } else {
                console.warn('Wake Lock: Page not visible or focused yet.');
            }
        });
    }

    releaseWakeLock() {
        this.shouldRecover = false;
        if (this.wakeLock) {
            this.wakeLock.release();
        }
    }
}
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

    private isRequesting = false;

    requestWakeLock() {
        if (!this.useLock) return;
        if (document.visibilityState !== 'visible') return;
        if (!('wakeLock' in navigator)) return;
        if (this.isRequesting) return;

        this.isRequesting = true;
        (navigator as any).wakeLock.request('screen')
        .then((lock: any) => {
            this.isRequesting = false;
            this.wakeLock = lock;
            this._isActive.set(true);
            this.shouldRecover = true;
            this.wakeLock.onrelease = () => {
                this._isActive.set(false);
                this.wakeLock = null;
            };
        })
        .catch((err: any) => {
            this.isRequesting = false;
            this._isActive.set(false);
            if (err.name === 'NotAllowedError') {
                this.shouldRecover = true;
                console.warn('Wake Lock: Page not visible or focused yet. Will retry on interaction');
                const retryLock = () => {
                    document.removeEventListener('click', retryLock);
                    document.removeEventListener('pointerup', retryLock);
                    document.removeEventListener('touchend', retryLock);
                    this.requestWakeLock();
                };
                document.addEventListener('click', retryLock, { once: true });
                document.addEventListener('pointerup', retryLock, { once: true });
                document.addEventListener('touchend', retryLock, { once: true });
            } else {
                this.shouldRecover = false;
                console.error('Wake Lock request failed', err);
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

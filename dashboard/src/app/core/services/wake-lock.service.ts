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
    private retryListenersAttached = false;

    private retryListener = () => {
        if (!this.wakeLock && !this.isRequesting) {
            this.requestWakeLock();
        }
    };

    private startRetryListeners() {
        if (this.retryListenersAttached) return;
        this.retryListenersAttached = true;
        // Listen to broad range of events, as some don't grant activation but we want to catch the first one that does
        ['click', 'touchend', 'pointerup', 'scroll', 'keydown', 'touchstart'].forEach(evt => {
            document.addEventListener(evt, this.retryListener, { passive: true });
        });
    }

    private stopRetryListeners() {
        if (!this.retryListenersAttached) return;
        this.retryListenersAttached = false;
        ['click', 'touchend', 'pointerup', 'scroll', 'keydown', 'touchstart'].forEach(evt => {
            document.removeEventListener(evt, this.retryListener);
        });
    }

    requestWakeLock() {
        if (!this.useLock) return;
        if (document.visibilityState !== 'visible') return;
        if (!('wakeLock' in navigator)) return;
        if (this.isRequesting) return;

        this.isRequesting = true;
        (navigator as any).wakeLock.request('screen')
        .then((lock: any) => {
            this.isRequesting = false;
            this.stopRetryListeners();
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
                // Silently start retry listeners to catch the first valid user gesture
                this.startRetryListeners();
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

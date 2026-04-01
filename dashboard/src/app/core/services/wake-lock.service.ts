import { inject, Injectable, signal } from '@angular/core';
import { SettingsService } from '@core';
import { HotToastService } from '@ngxpert/hot-toast';

@Injectable({ providedIn: 'root' })
export class WakeLockService {

    private readonly settingsService = inject(SettingsService);
    private readonly toaster = inject(HotToastService);
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

    private wakeLockRequestPromise: Promise<any> | null = null;
    private retryListenersAttached = false;

    private retryListener = () => {
        if (!this.wakeLock && !this.wakeLockRequestPromise) {
            this.requestWakeLock();
        }
    };

    private startRetryListeners() {
        if (this.retryListenersAttached) return;
        this.retryListenersAttached = true;
        ['click', 'pointerup', 'touchend', 'keydown'].forEach(evt => {
            document.addEventListener(evt, this.retryListener, { passive: true });
        });
    }

    private stopRetryListeners() {
        if (!this.retryListenersAttached) return;
        this.retryListenersAttached = false;
        ['click', 'pointerup', 'touchend', 'keydown'].forEach(evt => {
            document.removeEventListener(evt, this.retryListener);
        });
    }

    requestWakeLock() {
        this.toaster.info('Requesting wake lock...');
        if (!this.useLock) return;
        if (document.visibilityState !== 'visible') return;
        if (!('wakeLock' in navigator)) return;
        if (this.wakeLockRequestPromise) return; // Prevent concurrent API calls that could race and fail

        this.wakeLockRequestPromise = (navigator as any).wakeLock.request('screen');
        this.wakeLockRequestPromise!
        .then((lock: any) => {
            this.wakeLockRequestPromise = null;
            this.stopRetryListeners();
            this.wakeLock = lock;
            this._isActive.set(true);
            this.shouldRecover = true;
            this.toaster.success('Wake lock acquired.');
            this.wakeLock.onrelease = () => {
                this._isActive.set(false);
                this.wakeLock = null;
            };
        })
        .catch((err: any) => {
            this.toaster.error('Wake lock request failed.', err.name);
            this.wakeLockRequestPromise = null;
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

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

    private isRequesting = false;
    private readonly EVENTS = ['click', 'pointerup', 'touchend', 'keydown'];

    private toggleListeners(add: boolean) {
        this.EVENTS.forEach(evt =>
            document[add ? 'addEventListener' : 'removeEventListener'](evt, this.retryListener, { passive: true } as any)
        );
    }

    private retryListener = () => {
        const nav = navigator as any;
        if (nav.userActivation && !nav.userActivation.isActive) return;
        if (!this.wakeLock && !this.isRequesting) this.requestWakeLock();
    };

    async requestWakeLock() {
        this.toaster.info('Requesting wake lock...');
        if (!this.useLock || document.visibilityState !== 'visible' || !('wakeLock' in navigator) || this.isRequesting) return;

        this.isRequesting = true;
        try {
            this.wakeLock = await (navigator as any).wakeLock.request('screen');
            this.toggleListeners(false); // Clean up listeners on success
            this._isActive.set(true);
            this.shouldRecover = true;
            this.toaster.success('Wake lock acquired.');

            this.wakeLock.onrelease = () => {
                this._isActive.set(false);
                this.wakeLock = null;
            };
        } catch (err: any) {
            this._isActive.set(false);
            this.toaster.error('Wake lock request failed. ' + err.name);

            if (err.name === 'NotAllowedError') {
                this.shouldRecover = true;
                this.toggleListeners(true); // Start silently waiting for a valid user gesture
            } else {
                this.shouldRecover = false;
                console.error('Wake Lock request failed', err);
            }
        } finally {
            this.isRequesting = false;
        }
    }

    releaseWakeLock() {
        this.shouldRecover = false;
        if (this.wakeLock) {
            this.wakeLock.release();
        }
    }
}

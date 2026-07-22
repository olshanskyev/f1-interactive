import { computed, inject, Injectable, signal } from '@angular/core';
import { LiveService } from './live.service';

export const MAX_DELAY_SEC = 80; // 80 seconds max delay
@Injectable({
  providedIn: 'root',
})
export class SyncService {

    private readonly liveService = inject(LiveService);

    private readonly MAX_DELAY_MS = MAX_DELAY_SEC * 1000;

    private delayMs = 0;
    private syncTotalMs = signal(0);
    private passedMs = signal(0);
    private timer: any = null;

    public readonly leftTime = computed(() => Math.max(0, this.syncTotalMs() - this.passedMs()));

    private startTimer(pausedState: boolean) {
        this.timer = setInterval(() => {
            if (pausedState && this.passedMs() >= this.MAX_DELAY_MS) {
                this.clearTimer();
                return;
            }

            this.passedMs.update(p => p + 1000);

            if (!pausedState && this.passedMs() >= this.syncTotalMs()) {
                this.clearTimer();
                this.resetState();
            }
        }, 1000);
    }

    private clearTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    private resetState() {
        this.syncTotalMs.set(0);
        this.passedMs.set(0);
    }

    public setDelay(delayMs: number) {
        this.clearTimer();
        this.liveService.setDelay(delayMs);
        const toWait = delayMs - this.delayMs + this.leftTime();
        this.delayMs = delayMs;

        if (toWait <= 0) {
            this.resetState();
            return;
        }

        this.syncTotalMs.set(toWait);
        this.passedMs.set(0);
        this.startTimer(false);
    }

    public pause() {
        this.clearTimer();
        if (this.syncTotalMs() > 0) {
            this.delayMs -= this.leftTime();
            this.syncTotalMs.set(0);
        }
        this.passedMs.set(this.delayMs);
        this.liveService.setDelay(this.MAX_DELAY_MS);
        this.startTimer(true);
    }

    public resume() {
        this.clearTimer();
        this.delayMs = this.passedMs();
        this.liveService.setDelay(this.delayMs);
        this.resetState();
    }

    public getPassedTime() { return this.passedMs.asReadonly(); }
    public getLeftTime() { return this.leftTime; }
    public getDelayMs() { return this.delayMs; }

}
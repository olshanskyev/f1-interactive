import { Injectable, signal } from '@angular/core';
import screenfull from 'screenfull';

@Injectable({
    providedIn: 'root'
})
export class FullScreenServcie {
    private isFullScreenSignal = signal<boolean>(false);

    public toggleFullScreen(element?: Element) {
        if (screenfull.isEnabled) {
            screenfull.toggle(element);
            this.isFullScreenSignal.set(!this.isFullScreenSignal());
        }
    }

    public isFullScreen() {
        return this.isFullScreenSignal.asReadonly();
    }

    constructor() {
        if (screenfull.isEnabled) {
            screenfull.onchange(() => this.isFullScreenSignal.set(screenfull.isFullscreen));
        }
    }
}
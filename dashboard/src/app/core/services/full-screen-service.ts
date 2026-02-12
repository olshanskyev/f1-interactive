import { Injectable, signal } from '@angular/core';
import screenfull from 'screenfull';

@Injectable({
    providedIn: 'root'
})
export class FullScreenService {
    private isFullScreenSignal = signal<boolean>(false);

    public toggleFullScreen() {
        if (screenfull.isEnabled) {
            screenfull.toggle();
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
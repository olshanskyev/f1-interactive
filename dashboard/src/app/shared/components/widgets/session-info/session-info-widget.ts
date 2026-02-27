import { Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { ContaineredWidget } from '../containered-widget';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'session-info-widget',
    styleUrl:'./session-info-widget.scss',
    templateUrl: './session-info-widget.html',
    host: {
        '[class.in-grid]': '!!container',
    },
    imports: [
        MatIconModule,
        TranslateModule,
    ]
})
export class SessionInfoWidget extends ContaineredWidget {

    private clock = this.liveService.getExtrapolatedClockSignal();
    sessionInfo = this.liveService.getSessionInfoSignal();
    trackStatus = this.liveService.getTrackStatusSignal();
    sessionStatus = this.liveService.getSessionStatusSignal();

    private destroyRef = inject(DestroyRef);
    private tick = signal(0);

    timeRemaining = computed(() => {
        this.tick(); // re-evaluate every second
        const clock = this.clock();
        if (!clock?.Remaining) return undefined;

        if (!clock.Extrapolating) return clock.Remaining;
        const [h, m, s] = clock.Remaining.split(':').map(Number);
        const remainingMs = (h * 3600 + m * 60 + s) * 1000;
        const elapsedMs = Date.now() - new Date(clock.Utc).getTime();
        const adjustedMs = Math.max(0, remainingMs - elapsedMs);

        return new Date(adjustedMs).toISOString().substring(11, 19);
    });

    constructor() {
        super();
        const intervalId = setInterval(() => this.tick.update(v => v + 1), 1000);
        this.destroyRef.onDestroy(() => clearInterval(intervalId));
    }

    trackStatusColor = computed(() => {
        switch (this.trackStatus()?.Message) {
            case 'AllClear':
                return 'var(--f1-green)';
            case 'Yellow':
                return 'var(--f1-yellow)';
            case 'Red':
                return 'var(--f1-red)';
            case 'VSCDeployed':
            case 'SCDeployed':
                return 'var(--f1-blue)';
            default:
                return 'var(--inactive-color)';
        }
    });

    sessionStatusColor = computed(() => {
        switch (this.sessionStatus()?.Status) {
            case 'Started':
                return 'var(--f1-green)';
            case 'Aborted':
                return 'var(--f1-red)';
            case 'Finished':
            case 'Finalised':
            case 'Ends':
                return 'var(--second-color)';
            case 'Inactive':
                return 'var(--inactive-color)';
            default:
                return 'var(--inactive-color)';
        }
    });

    countryCode() {
        return this.sessionInfo()?.Meeting.Country.Code.toLowerCase();
    }
}
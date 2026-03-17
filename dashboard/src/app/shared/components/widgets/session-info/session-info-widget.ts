import { Component, computed, DestroyRef, effect, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ContaineredWidget } from '../containered-widget';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'session-info-widget',
    styleUrl:'./session-info-widget.scss',
    templateUrl: './session-info-widget.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
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
    sessionData = this.liveService.getSessionDataSignal();
    sessionFinished = this.liveService.getSessionFinishedSignal();
    lapCount = this.liveService.getLapCountSignal();
    isRace = this.liveService.getIsRaceSignal();
    private destroyRef = inject(DestroyRef);
    private tick = signal(0);

    timeRemaining = computed(() => {
        if (this.sessionFinished()) return '00:00:00';
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

    qualifyingPart = this.liveService.getQualifyingPartSignal();

    constructor() {
        super();
        const intervalId = setInterval(() => this.tick.update(v => v + 1), 1000);
        this.destroyRef.onDestroy(() => clearInterval(intervalId));
    }

    private readonly TRACK_STATUS_COLOR: Record<string, string> = {
        AllClear: 'var(--f1-green)',
        Yellow: 'var(--f1-yellow)',
        VSCDeployed: 'var(--f1-yellow)',
        SCDeployed: 'var(--f1-yellow)',
        VSCEnding: 'var(--f1-yellow)',
        SCEnding: 'var(--f1-yellow)',
        Red: 'var(--f1-red)',
    };

    private readonly SESSION_STATUS_COLOR: Record<string, string> = {
        Started: 'var(--f1-green)',
        Aborted: 'var(--f1-red)',
        Finished: 'var(--second-color)',
        Finalised: 'var(--second-color)',
        Ends: 'var(--second-color)',
        Inactive: 'var(--inactive-color)',
    };

    trackStatusColor = computed(() => {
        const msg = this.trackStatus()?.Message;
        return msg ? (this.TRACK_STATUS_COLOR[msg] ?? 'var(--inactive-color)') : 'var(--inactive-color)';
    });

    sessionStatusColor = computed(() => {
        const status = this.sessionStatus()?.Status;
        return status ? (this.SESSION_STATUS_COLOR[status] ?? 'var(--inactive-color)') : 'var(--inactive-color)';
    });

    countryCode = computed(() => {
        const code = this.sessionInfo()?.Meeting?.Country?.Code;
        return code ? code.toLowerCase() : undefined;
    });
}
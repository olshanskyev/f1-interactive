import { Component, input, computed, ChangeDetectionStrategy, inject, linkedSignal } from '@angular/core';
import { LiveService } from '@core/services/live/live.service';
import { TimingDataLinesItem, TimingStatsLinesItem } from '@core/types/f1types';

@Component({
    selector: 'lap-chip',
    templateUrl: './lap-chip.html',
    styleUrl: './lap-chip.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LapChip {
    liveService = inject(LiveService);
    timingData = input<TimingDataLinesItem>();
    timingStat = input<TimingStatsLinesItem>();
    qualifyingPart = this.liveService.getQualifyingPartSignal();
    // Computed helpers
    lastNotEmptyLapTime = computed(() => {
        const best = this.timingData()?.BestLapTimes;
        if (!best) return null;
        return Object.values(best).reverse().find((l: any) => l && l.Value && l.Value !== '') ?? null;
    });

    qualificationLapTime = computed(() => {
        if (this.timingData()?.KnockedOut) return this.lastNotEmptyLapTime()?.Value ?? '';
        if (this.qualifyingPart()) return this.timingData()?.BestLapTimes?.[this.qualifyingPart()! - 1]?.Value ?? '';
        return '';
    });

    // Animate only on subsequent updates, not on the first value (previous is undefined initially)
    animateQualificationLap = linkedSignal<string, boolean>({
        source: () => this.qualificationLapTime(),
        computation: (current, previous) => previous !== undefined && previous.source !== current
    });

    lastLapClass = computed(() => {
        const lt = this.timingData()?.LastLapTime;
        if (!lt) return '';
        return lt.OverallFastest ? 'text-f1-purple' : (lt.PersonalFastest ? 'text-f1-green' : '');
    });

    lastLapValue = computed(() => this.timingData()?.LastLapTime?.Value ?? '-');

    personalBestClass = computed(() => (this.timingStat()?.PersonalBestLapTime?.Position === 1) ? 'text-f1-purple' : 'text-f1-green');

    personalBestValue = computed(() => this.timingStat()?.PersonalBestLapTime?.Value ?? '');
}
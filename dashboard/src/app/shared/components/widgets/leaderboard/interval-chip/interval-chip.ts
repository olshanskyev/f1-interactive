import { Component, input, computed, ChangeDetectionStrategy, inject } from '@angular/core';
import { LiveService } from '@core/services/live/live.service';
import { TimingDataLinesItem } from '@core/types/f1types';

@Component({
    selector: 'interval-chip',
    templateUrl: './interval-chip.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IntervalChip {
    liveService = inject(LiveService);
    timingData = input<TimingDataLinesItem>();
    qualifyingPart = this.liveService.getQualifyingPartSignal();

    positionAheadColorClass = computed(() => {
        return this.timingData()?.IntervalToPositionAhead?.Catching ? 'text-f1-green' : '';
    });

    toPositionAhead = computed(() => {
        if (this.qualifyingPart()) {
            const stat = this.timingData()!.Stats?.[this.qualifyingPart()! - 1];
            return stat?.TimeDifftoPositionAhead ?? '-';
        }
        return this.timingData()?.IntervalToPositionAhead?.Value ??
            this.timingData()?.TimeDiffToPositionAhead ?? '-';
    });

    toLeader = computed(() => {
        if (this.qualifyingPart()) {
            const stat = this.timingData()!.Stats?.[this.qualifyingPart()! - 1];
            return stat?.TimeDiffToFastest ?? '-';
        }
        return this.timingData()?.GapToLeader ?? this.timingData()?.TimeDiffToFastest ?? '';
    });
}
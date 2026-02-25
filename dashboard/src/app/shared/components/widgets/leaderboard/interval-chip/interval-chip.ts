import { Component, input } from '@angular/core';
import { TimingDataLinesItem } from '@core/types/f1types';

@Component({
    selector: 'interval-chip',
    templateUrl: './interval-chip.html'
})
export class IntervalChip {
    timingData = input<TimingDataLinesItem>();
    qualifyingPart = input<number>();

    getLastNotEmptyStat() {
        const stats = Object.values(this.timingData()!.Stats).reverse().find(s =>
            s.TimeDifftoPositionAhead !== '' || s.TimeDiffToFastest !== '');
        return stats ?? null;
    }

    getPositionAheadColorClass() {
        const catching = this.timingData()?.IntervalToPositionAhead?.Catching;
        return (catching)? 'text-f1-green': '';
    }

    toPositionAhead(): string {
        // at qualification stat array is not empty
        if (this.qualifyingPart()) {
            const stat = this.timingData()!.Stats[this.qualifyingPart()! - 1]
            return stat?.TimeDifftoPositionAhead ?? '-';
        }

        return this.timingData()?.IntervalToPositionAhead?.Value ??
            this.timingData()?.TimeDiffToPositionAhead ?? '-';
    }

    toLeader(): string {
        if (this.qualifyingPart()) {
            const stat = this.timingData()!.Stats[this.qualifyingPart()! - 1]
            return stat?.TimeDiffToFastest ?? '-';
        }
        return this.timingData()?.GapToLeader ?? this.timingData()?.TimeDiffToFastest ?? '';
    }
}
import { Component, input } from '@angular/core';
import { TimingDataLinesItem, TimingStatsLinesItem } from '@core/types/f1types';

@Component({
    selector: 'lap-chip',
    templateUrl: './lap-chip.html'
})
export class LapChip {
    timingData = input<TimingDataLinesItem>();
    timingStat = input<TimingStatsLinesItem>();
    qualifyingPart = input<number>();


    // find last BestLapTime which is not empty
    getLastNotEmptyLapTime() {
        const lapTimes = Object.values(this.timingData()!.BestLapTimes).reverse().find(l => l.Value && l.Value !== '');
        return lapTimes ?? null;
    }

    getQualificationLapTime() {
        if (this.timingData()?.KnockedOut) {
            return this.getLastNotEmptyLapTime()?.Value ?? '';
        }
        return (this.qualifyingPart())?
            this.timingData()?.BestLapTimes[this.qualifyingPart()! - 1].Value ?? ''
        : '';
    }
}
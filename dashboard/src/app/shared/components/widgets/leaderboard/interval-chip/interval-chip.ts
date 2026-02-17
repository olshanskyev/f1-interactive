import { Component, input } from '@angular/core';
import { TimingDataLinesItem } from '@core/types/f1types';

@Component({
    selector: 'interval-chip',
    templateUrl: './interval-chip.html'
})
export class IntervalChip {
    timingData = input<TimingDataLinesItem>();

    getPositionAheadColorClass() {
        const catching = this.timingData()?.IntervalToPositionAhead?.Catching;
        return (catching)? 'text-f1-green': '';
    }
}
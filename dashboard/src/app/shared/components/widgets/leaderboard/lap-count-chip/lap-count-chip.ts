import { Component, input } from '@angular/core';
import { TimingDataLinesItem } from '@core/types/f1types';

@Component({
    selector: 'lap-count-chip',
    templateUrl: './lap-count-chip.html'
})
export class LapCountChip {
    timingData = input<TimingDataLinesItem>();
}
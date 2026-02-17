import { Component, input } from '@angular/core';
import { TimingDataLinesItem, TimingStatsLinesItem } from '@core/types/f1types';

@Component({
    selector: 'lap-chip',
    templateUrl: './lap-chip.html'
})
export class LapChip {
    timingData = input<TimingDataLinesItem>();
    timingStat = input<TimingStatsLinesItem>();
}
import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { TimingDataLinesItem } from '@core/types/f1types';

@Component({
    selector: 'lap-count-chip',
    templateUrl: './lap-count-chip.html',
    styles: `
        :host {
            align-content: center;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LapCountChip {
    timingData = input<TimingDataLinesItem>();
}
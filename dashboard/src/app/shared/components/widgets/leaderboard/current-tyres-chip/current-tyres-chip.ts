import { Component, input } from '@angular/core';
import { getLastNummericItem } from '@core/lib/arrays_maps';
import { Stint, TimingAppDataLinesItem } from '@core/types/f1types';

@Component({
    selector: 'current-tyres-chip',
    templateUrl: './current-tyres-chip.html'
})
export class CurrentTyresChip {
    timingAppData = input<TimingAppDataLinesItem>();

    getLastStint(): Stint | undefined {
        const timingAppData = this.timingAppData();
        return (timingAppData?.Stints)
        ? getLastNummericItem(timingAppData.Stints)
        : undefined;
    }

    getNumberOfPits() { // based on stints count (numberOfPitStops not precise?)
        const timingAppData = this.timingAppData();
        return (timingAppData)?(timingAppData.Stints)?
        Object.keys(timingAppData.Stints).length - 1: 0
        : 0;
    }
}
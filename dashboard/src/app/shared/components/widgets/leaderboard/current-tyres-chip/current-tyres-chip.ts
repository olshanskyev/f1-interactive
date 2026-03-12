import { Component, input, computed } from '@angular/core';
import { getLastNummericItem } from '@core/lib/arrays_maps';
import { Stint, TimingAppDataLinesItem } from '@core/types/f1types';

@Component({
    selector: 'current-tyres-chip',
    templateUrl: './current-tyres-chip.html'
})
export class CurrentTyresChip {
    timingAppData = input<TimingAppDataLinesItem>();

    // Computed cached values to avoid recalculating on every change-detection
    lastStint = computed<Stint | undefined>(() => {
        const tad = this.timingAppData();
        return tad?.Stints ? getLastNummericItem(tad.Stints) : undefined;
    });

    numberOfPits = computed(() => {
        const tad = this.timingAppData();
        const stints = tad?.Stints;
        if (!stints) return 0;
        return Math.max(0, Object.keys(stints).length - 1);
    });
}
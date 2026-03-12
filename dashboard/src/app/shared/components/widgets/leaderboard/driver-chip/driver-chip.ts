import { Component, input, computed } from '@angular/core';
import { DriverListItem, TimingAppDataLinesItem, TimingDataLinesItem } from '@core/types/f1types';

@Component({
    selector: 'driver-chip',
    templateUrl: './driver-chip.html'
})
export class DriverChip {
    Math = Math;
    driver = input<DriverListItem>();
    timingData = input<TimingDataLinesItem>();
    timingAppData = input<TimingAppDataLinesItem>();

    // Computed cached values for template hot-path
    teamColor = computed(() => '#' + (this.driver()?.TeamColour ?? '000000'));

    positionChange = computed(() => {
        const currPosition = this.timingData()?.Line;
        const startPosition = this.timingAppData()?.GridPos ?? undefined;
        if (currPosition != null && startPosition != null) return +startPosition - currPosition;
        return 0;
    });
}
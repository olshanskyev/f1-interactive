import { Component, input, computed, ChangeDetectionStrategy, inject } from '@angular/core';
import { LiveService } from '@core/services/live/live.service';
import { DriverListItem, TimingAppDataLinesItem, TimingDataLinesItem } from '@core/types/f1types';

@Component({
    selector: 'driver-chip',
    templateUrl: './driver-chip.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DriverChip {
    Math = Math;
    liveService = inject(LiveService);
    driver = input<DriverListItem>();
    timingData = input<TimingDataLinesItem>();
    timingAppData = input<TimingAppDataLinesItem>();
    isRace = this.liveService.getIsRaceSignal();

    // Computed cached values for template hot-path
    teamColor = computed(() => '#' + (this.driver()?.TeamColour ?? '000000'));

    positionChange = computed(() => {
        const currPosition = this.timingData()?.Line;
        const startPosition = this.timingAppData()?.GridPos ?? undefined;
        if (currPosition != null && startPosition != null) return +startPosition - currPosition;
        return 0;
    });
}
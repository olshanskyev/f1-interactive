import { Component, input, computed, ChangeDetectionStrategy, inject } from '@angular/core';
import { LiveService } from '@core/services/live/live.service';
import { DriverListItem } from '@core/types/f1types';

@Component({
    selector: 'position-driver-chip',
    templateUrl: './position-driver-chip.html',
    host: {
        '[style.--team-color]': 'teamColor()'
    },
    styles: `
        .vertical-indicator::after {
            position: absolute;
            top: 0;
            bottom: 0;
            left: -0.5rem;
            width: 0.25rem;
            content: '';
            background-color: var(--team-color);
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PositionDriverChip {
    Math = Math;
    liveService = inject(LiveService);
    driver = input<DriverListItem>();

    // Computed cached values for template hot-path
    teamColor = computed(() => '#' + (this.driver()?.TeamColour ?? '000000'));
}
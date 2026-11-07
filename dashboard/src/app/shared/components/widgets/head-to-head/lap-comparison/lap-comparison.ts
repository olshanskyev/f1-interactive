import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';
import { CurrentTyresChip } from '../../leaderboard/current-tyres-chip/current-tyres-chip';
import { HeadToHeadDriver } from '../head-to-head-driver';
import { HeadToHeadDriverHeader } from '../driver-header/driver-header';
import { HeadToHeadDriverSkeleton } from '../driver-skeleton/driver-skeleton';
import { HeadToHeadComparisonRow } from '../comparison-row/comparison-row';

export type LapComparisonMode = 'last' | 'best';

@Component({
  selector: 'head-to-head-lap-comparison',
  imports: [
    MatDividerModule,
    TranslateModule,
    CurrentTyresChip,
    HeadToHeadDriverHeader,
    HeadToHeadDriverSkeleton,
    HeadToHeadComparisonRow
  ],
  templateUrl: './lap-comparison.html',
  styleUrl: './lap-comparison.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeadToHeadLapComparison {
    readonly mode = input.required<LapComparisonMode>();
    readonly driver1 = input<HeadToHeadDriver>();
    readonly driver2 = input<HeadToHeadDriver>();

    readonly sectorIndexes = [0, 1, 2];

    readonly lap1 = computed(() => this.lapTime(this.driver1()));
    readonly lap2 = computed(() => this.lapTime(this.driver2()));
    readonly sectors1 = computed(() => this.sectorTimes(this.driver1()));
    readonly sectors2 = computed(() => this.sectorTimes(this.driver2()));

    private lapTime(driver: HeadToHeadDriver | undefined): string | undefined {
        return this.mode() === 'best'
            ? driver?.timingData?.BestLapTime?.Value
            : driver?.timingData?.LastLapTime?.Value;
    }

    private sectorTimes(driver: HeadToHeadDriver | undefined): (string | undefined)[] {
        return this.sectorIndexes.map(i => this.mode() === 'best'
            ? driver?.timingStats?.BestSectors?.[i]?.Value
            : driver?.timingData?.Sectors?.[i]?.Value);
    }
}

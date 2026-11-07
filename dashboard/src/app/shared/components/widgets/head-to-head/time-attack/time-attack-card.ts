import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { BestSectorsItem } from '@core/types/f1types';
import { Interval, lapTimeToSeconds, toInterval } from '@core/lib/lap-time';
import { SectorChip } from '../../leaderboard/sector-chip/sector-chip';
import { HeadToHeadDriver } from '../head-to-head-driver';
import { HeadToHeadDriverHeader } from '../driver-header/driver-header';

@Component({
  selector: 'head-to-head-time-attack-card',
  imports: [NgTemplateOutlet, SectorChip, HeadToHeadDriverHeader],
  templateUrl: './time-attack-card.html',
  styleUrl: './time-attack-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeadToHeadTimeAttackCard {
    readonly driver = input.required<HeadToHeadDriver>();
    readonly bestSectors = input<Record<number, BestSectorsItem>>();

    private readonly sectorDiffs = computed(() => {
        const best = this.bestSectors();
        return Object.values(this.driver().timingData?.Sectors ?? {}).map((sector, i) => {
            const bestValue = best?.[i]?.Value;
            const diff = sector.Value && bestValue
                ? lapTimeToSeconds(sector.Value) - lapTimeToSeconds(bestValue)
                : undefined;
            return { sector, diff };
        });
    });

    readonly sectors = computed(() => this.sectorDiffs().map(({ sector, diff }) => ({
        sector,
        diff: diff === undefined ? undefined : toInterval(diff)
    })));

    // running delta over the sectors completed so far in the current lap
    readonly totalDiff = computed<Interval | undefined>(() => {
        let total: number | undefined;
        for (const { diff } of this.sectorDiffs()) {
            if (diff === undefined) break;
            total = (total ?? 0) + diff;
        }
        return total === undefined ? undefined : toInterval(total);
    });

    // shown once all sectors of the lap are completed, until F1 clears them in the next lap
    readonly lapTime = computed(() => {
        const sectors = this.sectorDiffs();
        return sectors.length && sectors.every(({ sector }) => sector.Value)
            ? this.driver().timingData?.LastLapTime
            : undefined;
    });
}

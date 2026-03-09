import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TimingAppDataLinesItem, TimingDataLinesItem, TimingStatsLinesItem } from '@core/types/f1types';
import { TranslateModule } from '@ngx-translate/core';
import { IntervalChip } from '../interval-chip/interval-chip';
import { LapChip } from '../lap-chip/lap-chip';
import { KeyValuePipe } from '@angular/common';
import { LapCountChip } from '../lap-count-chip/lap-count-chip';

@Component({
  selector: 'leaderboard-sector',
  templateUrl: './leaderboard-sector.html',
  styleUrl: './leaderboard-sector.scss',
  imports: [MatIconModule, TranslateModule,
    IntervalChip,
    LapChip,
    KeyValuePipe,
    LapCountChip
  ],
})
export class LeaderboardSector{
  timingData = input<TimingDataLinesItem>();
  timingAppData = input<TimingAppDataLinesItem>();
  timingStat = input<TimingStatsLinesItem>();
  qualifyingPart = input<number>();

  hasBestSector(sectorNumber: number): boolean {
    return this.timingStat()?.BestSectors?.[sectorNumber]?.Position === 1;
  }
}

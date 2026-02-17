import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DriverListItem, TimingAppDataLinesItem, TimingDataLinesItem, TimingStatsLinesItem } from '@core/types/f1types';
import { TranslateModule } from '@ngx-translate/core';
import { DriverChip } from '../driver-chip/driver-chip';
import { IntervalChip } from '../interval-chip/interval-chip';
import { LapChip } from '../lap-chip/lap-chip';
import { KeyValuePipe } from '@angular/common';

@Component({
  selector: 'leaderboard-sector',
  templateUrl: './leaderboard-sector.html',
  styleUrl: './leaderboard-sector.scss',
  imports: [MatIconModule, TranslateModule,
    DriverChip,
    IntervalChip,
    LapChip,
    KeyValuePipe
  ],
})
export class LeaderboardSector{
  driver = input<DriverListItem>();
  timingData = input<TimingDataLinesItem>();
  timingAppData = input<TimingAppDataLinesItem>();
  timingStat = input<TimingStatsLinesItem>();

  hasBestSector(sectorNumber: number): boolean {
    return this.timingStat()?.BestSectors[sectorNumber].Position === 1;
  }
}

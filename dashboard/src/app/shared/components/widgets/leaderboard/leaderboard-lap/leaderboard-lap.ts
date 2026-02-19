import { KeyValue, KeyValuePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DriverListItem, TimingAppDataLinesItem, TimingDataLinesItem, TimingStatsLinesItem } from '@core/types/f1types';
import { TranslateModule } from '@ngx-translate/core';
import { DriverChip } from '../driver-chip/driver-chip';
import { LapChip } from '../lap-chip/lap-chip';
import { IntervalChip } from '../interval-chip/interval-chip';
import { CurrentTyresChip } from '../current-tyres-chip/current-tyres-chip';
import { keepOrder } from '@core/lib/arrays_maps';
import { LapCountChip } from '../lap-count-chip/lap-count-chip';

@Component({
  selector: 'leaderboard-lap',
  templateUrl: './leaderboard-lap.html',
  styleUrl: './leaderboard-lap.scss',
  imports: [MatIconModule, TranslateModule, KeyValuePipe,
    DriverChip,
    LapChip,
    IntervalChip,
    CurrentTyresChip,
    LapCountChip
  ],
})
export class LeaderboardDriver {
  driver = input<DriverListItem>();
  timingData = input<TimingDataLinesItem>();
  timingAppData = input<TimingAppDataLinesItem>();
  timingStat = input<TimingStatsLinesItem>();

  keepOrder = keepOrder;

  getSegmentClass(status: number) {
    switch(status) {
      case 2048:
      case 2052: return 'bg-f1-yellow';
      case 2049: return 'bg-f1-green';
      case 2051: return 'bg-f1-purple';
      case 2064: return 'bg-f1-blue';
      default: return 'bg-color-inactive';
    }
  }
}

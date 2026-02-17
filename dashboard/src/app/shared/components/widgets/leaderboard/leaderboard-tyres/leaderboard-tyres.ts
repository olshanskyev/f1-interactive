import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DriverListItem, Stint, TimingAppDataLinesItem, TimingDataLinesItem } from '@core/types/f1types';
import { TranslateModule } from '@ngx-translate/core';
import { DriverChip } from '../driver-chip/driver-chip';

import { CurrentTyresChip } from '../current-tyres-chip/current-tyres-chip';
import { KeyValuePipe } from '@angular/common';


@Component({
  selector: 'leaderboard-tyres',
  templateUrl: './leaderboard-tyres.html',
  styleUrl: './leaderboard-tyres.scss',
  imports: [MatIconModule, TranslateModule,
    DriverChip,
    CurrentTyresChip,
    KeyValuePipe
  ],
})
export class LeaderboardTyres{
  driver = input<DriverListItem>();
  timingData = input<TimingDataLinesItem>();
  timingAppData = input<TimingAppDataLinesItem>();


  getStintColor(stint: Stint) {
    switch (stint.Compound) {
      case 'SOFT':
        return '#F12F32';
      case 'MEDIUM':
        return '#FBCC1C';
      case 'HARD':
        return '#ffffff';
      case 'INTERMEDIATE':
        return '#128330';
      case 'WET':
        return '#1F6DA1';
      default:
        return '#52525B';
    }
  }

  getStintLength(stint: Stint): number {
    return stint.TotalLaps - stint.StartLaps;
  }

}

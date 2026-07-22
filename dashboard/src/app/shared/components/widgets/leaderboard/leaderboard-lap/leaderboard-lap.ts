import { KeyValuePipe } from '@angular/common';
import { Component, input, PipeTransform, Pipe, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TimingAppDataLinesItem, TimingDataLinesItem, TimingStatsLinesItem } from '@core/types/f1types';
import { TranslateModule } from '@ngx-translate/core';
import { LapChip } from '../lap-chip/lap-chip';
import { IntervalChip } from '../interval-chip/interval-chip';
import { CurrentTyresChip } from '../current-tyres-chip/current-tyres-chip';
import { LapCountChip } from '../lap-count-chip/lap-count-chip';
import { MiniSectorsChip } from '../mini-sectors-chip/mini-sectors-chip';

@Component({
  selector: 'leaderboard-lap',
  templateUrl: './leaderboard-lap.html',
  styleUrl: './leaderboard-lap.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, TranslateModule, KeyValuePipe,
    LapChip,
    IntervalChip,
    CurrentTyresChip,
    LapCountChip,
    MiniSectorsChip
  ],
})
export class LeaderboardLap {
  timingData = input<TimingDataLinesItem>();
  timingAppData = input<TimingAppDataLinesItem>();
  timingStat = input<TimingStatsLinesItem>();
}

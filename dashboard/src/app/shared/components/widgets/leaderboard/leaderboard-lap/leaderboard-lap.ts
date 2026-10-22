import { KeyValuePipe } from '@angular/common';
import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TimingAppDataLinesItem, TimingDataLinesItem, TimingStatsLinesItem } from '@core/types/f1types';
import { TranslateModule } from '@ngx-translate/core';
import { LapChip } from '../lap-chip/lap-chip';
import { IntervalChip } from '../interval-chip/interval-chip';
import { CurrentTyresChip } from '../current-tyres-chip/current-tyres-chip';
import { LapCountChip } from '../lap-count-chip/lap-count-chip';
import { SectorChip } from '../sector-chip/sector-chip';

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
    SectorChip
  ],
})
export class LeaderboardLap {
  timingData = input<TimingDataLinesItem>();
  timingAppData = input<TimingAppDataLinesItem>();
  timingStat = input<TimingStatsLinesItem>();
}

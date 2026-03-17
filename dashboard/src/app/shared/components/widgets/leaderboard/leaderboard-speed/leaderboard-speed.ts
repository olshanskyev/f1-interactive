import { Component, input, computed, Pipe, PipeTransform, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TimingAppDataLinesItem, TimingDataLinesItem, TimingStatsLinesItem } from '@core/types/f1types';
import { TranslateModule } from '@ngx-translate/core';
import { IntervalChip } from '../interval-chip/interval-chip';
import { LapChip } from '../lap-chip/lap-chip';
import { KeyValuePipe } from '@angular/common';
import { LapCountChip } from '../lap-count-chip/lap-count-chip';

@Pipe({
  name: 'hasBestSpeed',
  standalone: true
})
export class HasBestSpeedPipe implements PipeTransform {
  transform(timingStat: TimingStatsLinesItem | undefined, speedSectorKey: string): boolean {
    return timingStat?.BestSpeeds?.[speedSectorKey]?.Position === 1;
  }
}

@Component({
  selector: 'leaderboard-speed',
  templateUrl: './leaderboard-speed.html',
  styleUrl: './leaderboard-speed.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, TranslateModule,
    IntervalChip,
    LapChip,
    KeyValuePipe,
    LapCountChip,
    HasBestSpeedPipe
  ],
})
export class LeaderboardSpeed{
  timingData = input<TimingDataLinesItem>();
  timingAppData = input<TimingAppDataLinesItem>();
  timingStat = input<TimingStatsLinesItem>();
}

import { KeyValuePipe } from '@angular/common';
import { Component, input, PipeTransform, Pipe, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TimingAppDataLinesItem, TimingDataLinesItem, TimingStatsLinesItem } from '@core/types/f1types';
import { TranslateModule } from '@ngx-translate/core';
import { LapChip } from '../lap-chip/lap-chip';
import { IntervalChip } from '../interval-chip/interval-chip';
import { CurrentTyresChip } from '../current-tyres-chip/current-tyres-chip';
import { keepOrder } from '@core/lib/arrays_maps';
import { LapCountChip } from '../lap-count-chip/lap-count-chip';

const SEGMENT_CLASS_MAP = new Map<number, string>([
  [2048, 'bg-f1-yellow'],
  [2052, 'bg-f1-yellow'],
  [2049, 'bg-f1-green'],
  [2051, 'bg-f1-purple'],
  [2064, 'bg-f1-blue'],
]);

@Pipe({
  name: 'segmentClass',
  standalone: true
})
export class SegmentClassPipe implements PipeTransform {
  transform(status?: number): string {
    if (status === undefined) return 'bg-color-inactive';
    return SEGMENT_CLASS_MAP.get(status) ?? 'bg-color-inactive';
  }
}

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
    SegmentClassPipe
  ],
})
export class LeaderboardLap {
  timingData = input<TimingDataLinesItem>();
  timingAppData = input<TimingAppDataLinesItem>();
  timingStat = input<TimingStatsLinesItem>();
  qualifyingPart = input<number>();

  keepOrder = keepOrder;
}

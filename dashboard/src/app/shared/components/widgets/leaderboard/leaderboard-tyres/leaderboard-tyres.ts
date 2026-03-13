import { Component, input, Pipe, PipeTransform } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Stint, TimingAppDataLinesItem, TimingDataLinesItem } from '@core/types/f1types';
import { TranslateModule } from '@ngx-translate/core';

import { CurrentTyresChip } from '../current-tyres-chip/current-tyres-chip';
import { KeyValuePipe } from '@angular/common';
import { keepOrder } from '@core/lib/arrays_maps';

const STINT_COLOR: Record<string, string> = {
  SOFT: '#F12F32',
  MEDIUM: '#FBCC1C',
  HARD: '#ffffff',
  INTERMEDIATE: '#128330',
  WET: '#1F6DA1',
};

@Pipe({
  name: 'stintColor',
  standalone: true
})
export class StintColorPipe implements PipeTransform {
  transform(stint: Stint): string {
    return STINT_COLOR[stint.Compound] ?? '#52525B';
  }
}

@Pipe({
  name: 'stintLength',
  standalone: true
})
export class StintLengthPipe implements PipeTransform {
  transform(stint: Stint): number {
    return stint.TotalLaps - stint.StartLaps;
  }
}

@Component({
  selector: 'leaderboard-tyres',
  templateUrl: './leaderboard-tyres.html',
  styleUrl: './leaderboard-tyres.scss',
  imports: [MatIconModule, TranslateModule,
    CurrentTyresChip,
    KeyValuePipe,
    StintColorPipe,
    StintLengthPipe
  ],
})
export class LeaderboardTyres{
  timingData = input<TimingDataLinesItem>();
  timingAppData = input<TimingAppDataLinesItem>();
  keepOrder = keepOrder;

}

import { KeyValuePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { getLastNummericItem } from '@core/lib/arrays_maps';
import { DriverListItem, Stint, TimingAppDataLinesItem, TimingDataLinesItem } from '@core/types/f1types';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'leaderboard-driver',
  templateUrl: './leaderboard-driver.html',
  styleUrl: './leaderboard-driver.scss',
  imports: [MatIconModule, TranslateModule, KeyValuePipe],
})
export class LeaderboardDriver {
  driver = input<DriverListItem>();
  timingData = input<TimingDataLinesItem>();
  timingAppData = input<TimingAppDataLinesItem>();
  hasBestTime = input<Boolean>(false);
  Math = Math;

  getLastStint(): Stint | undefined {
    return (this.timingAppData()?.Stints)
      ? getLastNummericItem(this.timingAppData()!.Stints)
      : undefined;
  }

  getNumberOfPits() { // based on stints count (numberOfPitStops not precise?)
    return (this.timingAppData()?.Stints)?
      Object.keys(this.timingAppData()?.Stints!).length - 1
      : 0;
  }

  getPositionAheadColorClass() {
    const catching = this.timingData()?.IntervalToPositionAhead?.Catching;
    return (catching)? 'text-f1-green': '';
  }

  calculateGridPosDiff() {
    const currPosition = this.timingData()?.Line!;
    const startPosition = +this.timingAppData()?.GridPos!;
    if (currPosition != null && startPosition != null)
      return startPosition - currPosition;
    else
      return 0;
  }

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

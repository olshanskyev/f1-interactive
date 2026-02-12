import { Component,  computed,  effect, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TimingDataLinesItem } from '@core/types/f1types';
import { TranslateModule } from '@ngx-translate/core';
import { LeaderboardDriver } from './leaderboard-driver/leaderboard-driver';
import { areMapKeySequencesEqual, calculateSequenceChanges } from '@core/lib/arrays_maps';
import { BestLap } from '@core/types/custom';
import { ContaineredWidget } from '../containered-widget';

@Component({
  selector: 'leaderboard',
  templateUrl: './leaderboard.html',
  styleUrl: './leaderboard.scss',
  imports: [MatIconModule, TranslateModule, LeaderboardDriver, MatIconModule],
})
export class Leaderboard extends ContaineredWidget{

  timingDataMap = signal<Map<string, TimingDataLinesItem>>(new Map());
  driverList = this.liveService.getDriverListSignal();
  timingData = this.liveService.getTimingDataSignal();
  timingAppData = this.liveService.getTimingAppDataSignal();
  timingStats = this.liveService.getTimingStatsSignal();

  bestLap = computed<BestLap | undefined> (() => {
      const timingStats = this.timingStats();
      if (timingStats) {
        const sorted = Object.entries(timingStats.Lines)
          .sort(([,a], [,b]) => a.PersonalBestLapTime.Position - b.PersonalBestLapTime.Position);
        return {
          driverId: sorted[0][0],
          value: sorted[0][1].PersonalBestLapTime.Value
        };
      } else {
        return undefined;
      }
    }, {equal: this.bestLapIsEqual}
  );

  private bestLapIsEqual(c : BestLap | undefined, u: BestLap | undefined) {
    return c?.driverId === u?.driverId && c?.value === u?.value;
  }

  transitionStarted = false;
  movements = signal<Record<string, 'up' | 'down' | null>>({});
  overallFastestLap = computed(() => {

  });

  constructor() {
    super();
    effect(() => { // for animating driver positions changing
      if (this.timingData()) {
        const interval = setInterval(() => {
          if (!this.transitionStarted) {
            this.transitionStarted = true;
            // sorting driver positions base on TimingData.Lines.Line
            const newTimingDataMap = new Map(
              Object.entries(this.timingData()!.Lines).sort(
                (([ , a], [ , b]) => a.Line - b.Line)
              )
            );
            if (!areMapKeySequencesEqual(this.timingDataMap(), newTimingDataMap)) { // avoid unneccessary transitions
              this.movements.set(calculateSequenceChanges(this.timingDataMap(), newTimingDataMap));
              if (!document.startViewTransition) { // startViewTransition not supported by browser
                this.timingDataMap.set(newTimingDataMap);
                this.transitionStarted = false;
              } else {
                document.startViewTransition(() =>  //start animation
                  this.timingDataMap.set(newTimingDataMap)
                ).finished.then(() => {this.transitionStarted = false; this.movements.set({});});
              }
            } else {
              this.transitionStarted = false;
            }

            clearInterval(interval);
          }
        }, 100);
      }

    });
  }

  isMovingUp(id: string) {
    return this.movements()[id] === 'up';
  }

  isMovingDown(id: string) {
    return this.movements()[id]  === 'down';
  }

}

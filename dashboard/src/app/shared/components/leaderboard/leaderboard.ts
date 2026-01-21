import { Component,  computed,  effect, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DriverList, TimingAppData, TimingData, TimingDataLinesItem } from '@core/types/f1types';
import { TranslateModule } from '@ngx-translate/core';
import { LeaderboardDriver } from './leaderboard-driver/leaderboard-driver';
import { areMapKeySequencesEqual, calculateSequenceChanges } from '@core/lib/arrays_maps';
import { BestLap } from '@core/types/custom';

@Component({
  selector: 'leaderboard',
  templateUrl: './leaderboard.html',
  styleUrl: './leaderboard.scss',
  imports: [MatIconModule, TranslateModule, LeaderboardDriver, MatIconModule],
})
export class Leaderboard {
  driverList = input<DriverList | undefined>();
  timingData = input<TimingData | undefined>();
  timingAppData = input<TimingAppData | undefined>();
  timingDataMap = signal<Map<string, TimingDataLinesItem>>(new Map());
  bestLap = input<BestLap | undefined>();

  transitionStarted = false;
  movements = signal<Record<string, 'up' | 'down' | null>>({});
  overallFastestLap = computed(() => {

  });

  constructor() {
    effect(() => { // for animating driver positions changing
      if (this.timingData()) {
        const interval = setInterval(() => {
          if (!this.transitionStarted) {
            this.transitionStarted = true;
            // sorting driver positions base on TimingData.Lines.Line
            const newTimingDataMap = new Map(Object.entries(this.timingData()!.Lines).sort((([,a], [,b]) => a.Line - b.Line)));
            if (!areMapKeySequencesEqual(this.timingDataMap(), newTimingDataMap)) { // avoid unneccessary transitions
              this.movements.set(calculateSequenceChanges(this.timingDataMap(), newTimingDataMap));
              if (!document.startViewTransition) { // startViewTransition not supported by browser
                this.timingDataMap.set(newTimingDataMap);
                this.transitionStarted = false;
              } else {
                document.startViewTransition(() =>  //start animation
                  this.timingDataMap.set(newTimingDataMap)
                ).finished.then(() => {this.transitionStarted = false; this.movements.set({})});
              }
            } else {
              this.transitionStarted = false;
            }

            clearInterval(interval);
          }
        }, 100)
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

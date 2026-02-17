import { Component, computed, effect, inject, input, linkedSignal, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TimingDataLinesItem } from '@core/types/f1types';
import { TranslateModule } from '@ngx-translate/core';
import { LeaderboardDriver } from './leaderboard-lap/leaderboard-lap';
import { areMapKeySequencesEqual, calculateSequenceChanges } from '@core/lib/arrays_maps';
import { ContaineredWidget } from '../containered-widget';
import { ViewTransitionService } from '../../../../core/services/view-transition.service';
import {MatTabsModule} from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatChipSelectionChange, MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { LeaderboardSector } from './leaderboard-sector/leaderboard-sector';
import { LeaderboardSpeed } from './leaderboard-speed/leaderboard-speed';
import { LeaderboardTyres } from './leaderboard-tyres/leaderboard-tyres';

@Component({
  selector: 'leaderboard',
  templateUrl: './leaderboard.html',
  styleUrl: './leaderboard.scss',
  imports: [
    MatIconModule,
    TranslateModule,
    LeaderboardDriver,
    LeaderboardSector,
    LeaderboardSpeed,
    LeaderboardTyres,
    MatIconModule,
    MatTabsModule,
    MatButtonModule,
    MatChipsModule,
    FormsModule,
    MatDividerModule
  ],
})
export class Leaderboard extends ContaineredWidget {

  timingDataMap = signal<Map<string, TimingDataLinesItem>>(new Map());
  driverList = this.liveService.getDriverListSignal();
  timingData = this.liveService.getTimingDataSignal();
  timingAppData = this.liveService.getTimingAppDataSignal();
  timingStats = this.liveService.getTimingStatsSignal();
  readonly uniqueId = Math.random().toString(36).substring(2, 9);

  settingsMode = computed(() => this.settings()?.['mode'] ?? 'all');
  showHeader = computed(() => this.settings()?.['showHeader'] ?? true);
  mode = linkedSignal(() =>(this.settingsMode() === 'all') ? 'laps' : this.settingsMode());

  movements = signal<Record<string, 'up' | 'down' | null>>({});

  private viewTransitionService = inject(ViewTransitionService);
  private transitionVersion = 0;

  constructor() {
    super();
    effect(() => { // for animating driver positions changing
      if (this.timingData()) {
        // sorting driver positions based on TimingData.Lines.Line
        const newTimingDataMap = new Map(
          Object.entries(this.timingData()!.Lines).sort(
            (([ , a], [ , b]) => a.Line - b.Line)
          )
        );
        if (!areMapKeySequencesEqual(this.timingDataMap(), newTimingDataMap)) { // avoid unnecessary transitions
          const version = ++this.transitionVersion;
          this.movements.set(calculateSequenceChanges(this.timingDataMap(), newTimingDataMap));
          this.viewTransitionService.requestTransition(() =>
            this.timingDataMap.set(newTimingDataMap)
          ).then(() => {
            // Only clear movements if no newer transition has been requested
            if (this.transitionVersion === version) {
              this.movements.set({});
            }
          });
        }
      }
    });
  }

  isMovingUp(id: string) {
    return this.movements()[id] === 'up';
  }

  isMovingDown(id: string) {
    return this.movements()[id]  === 'down';
  }

  onModeSelectionChange(event: MatChipSelectionChange) {
    // If the user tries to deselect the chip, re-select it immediately
    if (!event.selected) {
      event.source.select();
    }
  }
}

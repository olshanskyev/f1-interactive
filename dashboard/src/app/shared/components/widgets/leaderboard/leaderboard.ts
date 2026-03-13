import { Component, computed, effect, inject, linkedSignal, signal, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TimingDataLinesItem } from '@core/types/f1types';
import { TranslateModule } from '@ngx-translate/core';
import { LeaderboardLap } from './leaderboard-lap/leaderboard-lap';
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
import { sortTimingDataByPosition } from '@core/lib/sorting';
import { qualifyingPart, sessionYear } from '@core/lib/sub-signals';
import { DriverChip } from './driver-chip/driver-chip';


@Component({
  selector: 'leaderboard',
  templateUrl: './leaderboard.html',
  styleUrl: './leaderboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIconModule,
    TranslateModule,
    LeaderboardLap,
    LeaderboardSector,
    LeaderboardSpeed,
    LeaderboardTyres,
    MatIconModule,
    MatTabsModule,
    MatButtonModule,
    MatChipsModule,
    FormsModule,
    MatDividerModule,
    DriverChip
  ],
})
export class Leaderboard extends ContaineredWidget {

  timingDataMap = signal<Map<string, TimingDataLinesItem>>(new Map());
  driverList = this.liveService.getDriverListSignal();
  timingData = this.liveService.getTimingDataSignal();
  timingAppData = this.liveService.getTimingAppDataSignal();
  timingStats = this.liveService.getTimingStatsSignal();
  sessionData = this.liveService.getSessionDataSignal();
  sessionInfo = this.liveService.getSessionInfoSignal();

  sessionYear = sessionYear(this.sessionInfo);
  qualifyingPart = qualifyingPart(this.sessionData);

  readonly uniqueId = Math.random().toString(36).substring(2, 9);

  settingsMode = computed(() => this.settings()?.['mode'] ?? 'all');
  showHeader = computed(() => this.settings()?.['showHeader'] ?? true);
  mode = linkedSignal(() =>(this.settingsMode() === 'all') ? 'laps' : this.settingsMode());

  movements = signal<Record<string, 'up' | 'down' | null>>({});
  isScrolled = signal(false);

  // Snapshot computed so template lookups are cheap and only re-evaluate when `movements` changes
  movementsSnapshot = computed(() => this.movements());

  // Stable array of [id, timingData] entries for template iteration (avoids Map->Array work in template)
  entriesArray = computed(() => Array.from(this.timingDataMap().entries()));

  // Set of positions considered in the elimination zone based on session year and qualifying part
  eliminationPositions = computed(() => {
    const q = this.qualifyingPart();
    if (!q) return new Set<number>();
    const firstEliminationThreshold = (this.sessionYear() < 2026) ? 15 : 16;
    const set = new Set<number>();
    if (q === 1) {
      for (let p = firstEliminationThreshold + 1; p <= 30; p++) set.add(p);
    } else {
      for (let p = 11; p <= 30; p++) set.add(p);
    }
    return set;
  });

  // Map of driverId -> out boolean computed from timingDataMap so templates can read cheaply
  driversOut = computed(() => {
    const map = this.timingDataMap();
    const out: Record<string, boolean> = {};
    map.forEach((v, k) => {
      out[k] = !!(v.Retired || v.Stopped || v.KnockedOut);
    });
    return out;
  });

  private viewTransitionService = inject(ViewTransitionService);
  private transitionVersion = 0;

  constructor() {
    super();
    effect(() => { // for animating driver positions changing
      if (this.timingData()) {
        // sorting driver positions based on TimingData.Lines.Line
        const newTimingDataMap = sortTimingDataByPosition(this.timingData()!.Lines);
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
    return this.movementsSnapshot()[id] === 'up';
  }

  isMovingDown(id: string) {
    return this.movementsSnapshot()[id] === 'down';
  }

  onScroll(event: Event) {
    const target = event.target as HTMLElement;
    this.isScrolled.set(target.scrollLeft > 0);
  }

  onModeSelectionChange(event: MatChipSelectionChange) {
    // If the user tries to deselect the chip, re-select it immediately
    if (!event.selected) {
      event.source.select();
    }
  }
}

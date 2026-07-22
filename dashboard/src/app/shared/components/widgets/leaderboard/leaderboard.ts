import { Component, computed, linkedSignal, signal, ChangeDetectionStrategy, Pipe, PipeTransform } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TimingDataLinesItem } from '@core/types/f1types';
import { TranslateModule } from '@ngx-translate/core';
import { LeaderboardLap } from './leaderboard-lap/leaderboard-lap';
import { ContaineredWidget } from '../containered-widget';
import {MatTabsModule} from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatChipSelectionChange, MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { LeaderboardSector } from './leaderboard-sector/leaderboard-sector';
import { LeaderboardSpeed } from './leaderboard-speed/leaderboard-speed';
import { LeaderboardTyres } from './leaderboard-tyres/leaderboard-tyres';
import { DriverChip } from './driver-chip/driver-chip';
import { createAnimatedTimingMap } from '../animated-timing-map';

@Pipe({
  name: 'isDriverOut',
  standalone: true
})
export class IsDriverOutPipe implements PipeTransform {
  transform(timingData: TimingDataLinesItem | undefined): boolean {
    return !!(timingData?.Retired || timingData?.Stopped || timingData?.KnockedOut);
  }
}

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
    DriverChip,
    IsDriverOutPipe
  ],
})
export class Leaderboard extends ContaineredWidget {

  private animated = createAnimatedTimingMap(this.liveService.getSortedTimingDataSignal());

  driverList = this.liveService.getDriverListSignal();
  timingData = this.liveService.getTimingDataSignal();
  timingAppData = this.liveService.getTimingAppDataSignal();
  timingStats = this.liveService.getTimingStatsSignal();
  sessionData = this.liveService.getSessionDataSignal();
  sessionInfo = this.liveService.getSessionInfoSignal();

  sessionYear = this.liveService.getSessionYearSignal();
  qualifyingPart = this.liveService.getQualifyingPartSignal();

  readonly uniqueId = Math.random().toString(36).substring(2, 9);

  settingsMode = computed(() => this.settings()?.['mode'] ?? 'all');
  showHeader = computed(() => this.settings()?.['showHeader'] ?? true);
  mode = linkedSignal(() =>(this.settingsMode() === 'all') ? 'laps' : this.settingsMode());

  isScrolled = signal(false);

  // Position-change animation state shared with select-driver via the helper
  timingDataMap = this.animated.timingDataMap;
  movements = this.animated.movements;
  movementsSnapshot = this.animated.movementsSnapshot;
  entriesArray = this.animated.entriesArray;

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

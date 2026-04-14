import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { ContaineredWidget } from '../containered-widget';
import { sortTimingDataByPosition } from '@core/lib/sorting';
import { areMapKeySequencesEqual, calculateSequenceChanges } from '@core/lib/arrays-maps';
import { ViewTransitionService } from '@core/services/view-transition.service';
import { TimingDataLinesItem } from '@core/types/f1types';
import { TranslateModule } from '@ngx-translate/core';
import { PositionDriverChip } from '../leaderboard/driver-chip/position-driver-chip';
import { MatIconModule } from '@angular/material/icon';
import { DriverSelectionService } from '@core/services/driver-selection.service';


@Component({
  selector: 'select-driver-widget',
  imports: [
    TranslateModule,
    PositionDriverChip,
    MatIconModule
  ],
  templateUrl: './select-driver-widget.html',
  styleUrl: './select-driver-widget.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    // set data-containered attribute when the widget is inside a container
    '[attr.data-containered]': 'container ? "true" : null'
  }
})
export class SelectDriverWidget extends ContaineredWidget {

  driverSelectionService = inject(DriverSelectionService);
  timingDataMap = signal<Map<string, TimingDataLinesItem>>(new Map());
  driverList = this.liveService.getDriverListSignal();
  timingData = this.liveService.getTimingDataSignal();
  selectedDrivers = this.driverSelectionService.getSelectedDrivers();

  movements = signal<Record<string, 'up' | 'down' | null>>({});

  // Snapshot computed so template lookups are cheap and only re-evaluate when `movements` changes
  movementsSnapshot = computed(() => this.movements());
  entriesArray = computed(() => Array.from(this.timingDataMap().entries()));

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
            setTimeout(() => {
              // Only clear movements if no newer transition has been requested
              if (this.transitionVersion === version) {
                this.movements.set({});
              }
            }, 2000);
          });
        }
      }
    });
  }

  selectDriver(driverId: string) {
    (this.selectedDrivers().has(driverId))?
      this.driverSelectionService.deselect(driverId) :
      this.driverSelectionService.select(driverId);
  }

}
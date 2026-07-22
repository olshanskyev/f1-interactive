import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ContaineredWidget } from '../containered-widget';
import { TranslateModule } from '@ngx-translate/core';
import { PositionDriverChip } from '../leaderboard/driver-chip/position-driver-chip';
import { MatIconModule } from '@angular/material/icon';
import { DriverSelectionService } from '@core/services/driver-selection.service';
import { createAnimatedTimingMap } from '../animated-timing-map';


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
  private animated = createAnimatedTimingMap(this.liveService.getSortedTimingDataSignal());

  driverList = this.liveService.getDriverListSignal();
  selectedDrivers = this.driverSelectionService.getSelectedDrivers();

  // Position-change animation state shared with leaderboard via the helper
  timingDataMap = this.animated.timingDataMap;
  movements = this.animated.movements;
  movementsSnapshot = this.animated.movementsSnapshot;
  entriesArray = this.animated.entriesArray;

  selectDriver(driverId: string) {
    (this.selectedDrivers().has(driverId))?
      this.driverSelectionService.deselect(driverId) :
      this.driverSelectionService.select(driverId);
  }

}
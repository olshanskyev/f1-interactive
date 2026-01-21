import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { LiveService } from '@core';
import { BestLap } from '@core/types/custom';
import { Leaderboard, SimPlayer } from '@shared';
import { NgxRolesService } from 'ngx-permissions';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  imports: [
    Leaderboard,
    SimPlayer
  ],
})
export class Dashboard {

  private readonly liveService = inject(LiveService);
  private readonly roleService = inject(NgxRolesService);
  roles = toSignal(this.roleService.roles$);
  isAdmin = computed(() => {
    return (this.roles()?.['ADMIN'] != null);
  })
  driverList = this.liveService.getDriverListSignal();
  timingData = this.liveService.getTimingDataSignal();
  timingAppData = this.liveService.getTimingAppDataSignal();
  timingStats = this.liveService.getTimingStatsSignal();
  newEvent = toSignal(this.liveService.live(undefined, undefined));

  bestLap = computed<BestLap | undefined> (() => {
    const timingStats = this.timingStats();
    if (timingStats) {
      const sorted = Object.entries(timingStats.Lines).sort(([,a], [,b]) => a.PersonalBestLapTime.Position - b.PersonalBestLapTime.Position)
      return {
        driverId: sorted[0][0],
        value: sorted[0][1].PersonalBestLapTime.Value
      }
    } else {
      return undefined;
    }
  }, {equal: this.bestLapIsEqual}
  );


  private bestLapIsEqual(c : BestLap | undefined, u: BestLap | undefined) {
    return c?.driverId === u?.driverId && c?.value === u?.value;
  }



}

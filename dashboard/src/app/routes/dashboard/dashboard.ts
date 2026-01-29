import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { LayoutsService, LiveService, WidgetFactory } from '@core';
import { BestLap } from '@core/types/custom';
import { DisplayWidget, Layout } from '@core/types/widgets';
import { GridContainerComponent, Leaderboard, SimPlayer, WidgetContainerDirective } from '@shared';
import { NgxRolesService } from 'ngx-permissions';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  imports: [
    Leaderboard,
    SimPlayer,
    GridContainerComponent,
    CommonModule,
    WidgetContainerDirective

  ],
})
export class DashboardComponent {

  private readonly liveService = inject(LiveService);
  private readonly roleService = inject(NgxRolesService);
  private readonly layoutsService = inject(LayoutsService);
  private readonly widgetFactory = inject(WidgetFactory);
  selectedLayout = this.layoutsService.getSelectedLayout()
  displayWidgets = signal<DisplayWidget[] | undefined>(undefined);

  roles = toSignal(this.roleService.roles$);
  isAdmin = computed(() => {
    return (this.roles()?.['ADMIN'] != null);
  });

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

  private loadWidgets(layout: Layout) {
      const toDisplay: DisplayWidget[] = layout.widgets.map(item => {
          const widget = this.widgetFactory.getWidgetByType(item.type);
          return {...item, el: widget!.widgetPreview};
      });
      this.displayWidgets.set(toDisplay);
  }

  constructor() {
      effect(() => {
        if (this.selectedLayout()) {
          this.loadWidgets(this.selectedLayout()!);
        }
      })
  }

}

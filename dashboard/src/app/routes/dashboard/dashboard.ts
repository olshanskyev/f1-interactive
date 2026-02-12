import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { LayoutsService, LiveService, WidgetFactory } from '@core';
import { DisplayWidget, Layout } from '@core/types/widgets';
import { GridContainerComponent, Leaderboard, SimPlayer, WeatherWidget, WidgetContainerDirective } from '@shared';
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
    WidgetContainerDirective,
    WeatherWidget
  ],
})
export class DashboardComponent {

  private readonly liveService = inject(LiveService);
  private readonly roleService = inject(NgxRolesService);
  private readonly layoutsService = inject(LayoutsService);
  private readonly widgetFactory = inject(WidgetFactory);
  selectedLayout = this.layoutsService.getSelectedLayout();
  displayWidgets = signal<DisplayWidget[] | undefined>(undefined);

  roles = toSignal(this.roleService.roles$);
  isAdmin = computed(() => {
    const roles = this.roles(); return (roles?.['ADMIN'] != null);
  });

  newEvent = toSignal(this.liveService.live(undefined, undefined));

  private loadWidgets(layout: Layout) {
      const toDisplay: DisplayWidget[] = layout.widgets.map(item => {
          const widget = this.widgetFactory.getWidgetByType(item.type);
          return {...item, ...widget!};
      });
      this.displayWidgets.set(toDisplay);
  }

  constructor() {
      effect(() => {
        if (this.selectedLayout()) {
          this.loadWidgets(this.selectedLayout()!);
        }
      });
  }

}

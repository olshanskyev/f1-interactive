import { CdkDrag } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, linkedSignal, signal, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { LayoutsService, SettingsService, WidgetFactory } from '@core';
import { isAdmin } from '@core/lib/roles';
import { LiveService } from '@core/services/live/live.service';
import { DisplayWidget, Layout, LayoutWidget, WidgetContainer, WidgetSize, WidgetType } from '@core/types/widgets';
import { GridContainerComponent, Leaderboard, RaceControlMessagesWidget, SessionInfoWidget, SettingsDialog, SimPlayer, TeamRadioWidget, TrackMapWidget, WeatherWidget, WidgetContainerDirective, WidgetResizeHandleDirective } from '@shared';
import { NgxRolesService } from 'ngx-permissions';
import { ToolsPanelComponent } from './tools-panel/tools-panel';
import { MatButtonModule } from '@angular/material/button';
import { calcGridOffset } from '@core/lib/offsets';
import { MatDialog } from '@angular/material/dialog';
import { isMobile } from '@core/lib/device';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Leaderboard,
    SimPlayer,
    GridContainerComponent,
    CommonModule,
    WidgetContainerDirective,
    TrackMapWidget,
    SessionInfoWidget,
    WeatherWidget,
    RaceControlMessagesWidget,
    TeamRadioWidget,
    CdkDrag,
    WidgetResizeHandleDirective,
    MatIconModule,
    ToolsPanelComponent,
    MatButtonModule
  ],
})
export class DashboardComponent {

  private readonly liveService = inject(LiveService);
  private readonly roleService = inject(NgxRolesService);
  private readonly layoutsService = inject(LayoutsService);
  private readonly widgetFactory = inject(WidgetFactory);
  private readonly settingsService = inject(SettingsService);
  private readonly dialog = inject(MatDialog);
  selectedLayout = this.layoutsService.getSelectedLayout();
  userLayout = linkedSignal<Layout | undefined>(() => this.selectedLayout());
  isEditing = this.layoutsService.getIsEditing();

  gridContainer = viewChild('gridContainer', {read: GridContainerComponent});
  displayWidgets = signal<DisplayWidget[] | undefined>(undefined);
  roles = toSignal(this.roleService.roles$);
  isAdmin = computed(() =>
    isAdmin(this.roles())
  );

  useSimulator = this.settingsService.options.useSimulator;

  newEvent = toSignal(this.liveService.live(undefined, undefined));
  isMobile = signal(isMobile);

  private loadWidgets(layout: Layout) {
      const toDisplay: DisplayWidget[] = layout.widgets.map(item => {
          const widget = this.widgetFactory.getWidgetByType(item.type);
          return {...item, ...widget!};
      });
      this.displayWidgets.set(toDisplay);
  }

  updateDisplayedWidget(index: number, properties: Record<string, any>) {
      this.displayWidgets.update(widgets => {
          if (!widgets) return widgets;
          // Update the widget's appearance based on the provided properties
          Object.keys(properties).forEach(key => {
              (widgets[index] as any)[key] = properties[key];
          });
          return [...widgets];
      });
  }

  onWidgetViewChanged(event: {widgetIndex: number, container: WidgetContainer}) {
      const selectedLayout = this.userLayout();
      if (selectedLayout) {
          selectedLayout.widgets[event.widgetIndex].size = event.container.size;
          selectedLayout.widgets[event.widgetIndex].position = event.container.position;

          this.updateDisplayedWidget(event.widgetIndex,
              {size: event.container.size, position: event.container.position});
          this.layoutsService.saveLayout(selectedLayout);
      }
  }

  onWidgetAdded(event: {widgetType: WidgetType, position: {x: number, y: number}}) {
      const grid = this.gridContainer();
      const selectedLayout = this.userLayout();
      if (grid && selectedLayout) {
          const gridOffset = calcGridOffset(grid);
          const relativeX = event.position.x - gridOffset.x;
          const relativeY = event.position.y - gridOffset.y;
          const cellSize = grid.cellSize()();

          let colStart = Math.floor(relativeX / cellSize) + 1;
          let rowStart = Math.floor(relativeY / cellSize) + 1;

          const widgetComponent = this.widgetFactory.getWidgetByType(event.widgetType);
          if (!widgetComponent) return;

          const sizeToAdd: WidgetSize = widgetComponent.meta.defaultSizes[0];

          const maxCol = selectedLayout.gridSize.gridColumns - sizeToAdd.colSpan + 1;
          const maxRow = selectedLayout.gridSize.gridRows - sizeToAdd.rowSpan + 1;

          colStart = Math.max(1, Math.min(colStart, maxCol));
          rowStart = Math.max(1, Math.min(rowStart, maxRow));

          const layoutWidget: LayoutWidget = {
              type: event.widgetType,
              position: { colStart, rowStart },
              size: sizeToAdd,
              pinned: false
          };
          const newLayout = {
              ...selectedLayout, widgets: [...selectedLayout.widgets, layoutWidget]
          };
          this.loadWidgets(newLayout);
          this.userLayout.set(newLayout);
          this.layoutsService.saveLayout(newLayout);
      }
  }

  onDeleteWidget(index: number) {
      const selectedLayout = this.userLayout();
      if (selectedLayout) {
          const newWidgets = selectedLayout.widgets.filter((_, i) => i !== index);
          const newLayout = {...selectedLayout, widgets: newWidgets};
          this.loadWidgets(newLayout);
          this.userLayout.set(newLayout);
          this.layoutsService.saveLayout(newLayout);
      }
  }

  onPinWidget(index: number) {
      const selectedLayout = this.userLayout();
      if (selectedLayout) {
          selectedLayout.widgets[index].pinned = !selectedLayout.widgets[index].pinned;
          this.updateDisplayedWidget(index, {pinned: selectedLayout.widgets[index].pinned});
          this.layoutsService.saveLayout(selectedLayout);
      }
  }

  onWidgetSettings(index: number) {
      const selectedLayout = this.userLayout();
      const displayWidgets = this.displayWidgets();

      if (selectedLayout && displayWidgets) {
          const widget = displayWidgets[index];
          const dialogRef = this.dialog.open(SettingsDialog, {
              data: {
                  settingsList: widget.meta.settingsList,
                  currentSettings: widget.settings || {},
                  widgetTitle: widget.type
              }
          });

          dialogRef.afterClosed().subscribe(result => {
              if (result) {
                  selectedLayout.widgets[index].settings = result;
                  this.updateDisplayedWidget(index, { settings: result });
                  this.layoutsService.saveLayout(selectedLayout);
              }
          });
      }
  }

  constructor() {
    effect(() => {
      if (this.selectedLayout()) {
        this.loadWidgets(this.selectedLayout()!);
      }
    });
  }

}

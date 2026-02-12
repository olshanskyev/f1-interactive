import { CommonModule } from '@angular/common';
import { Component, inject, signal, viewChild } from '@angular/core';
import { WidgetFactory,  } from '@core/services/widget-factory';
import { GridContainerComponent, WidgetContainerDirective, WidgetResizeHandleDirective, SettingsDialog } from '@shared';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { DisplayWidget, Layout, LayoutWidget, WidgetContainer, WidgetSize, WidgetType } from '@core/types/widgets';
import { LayoutsService } from '@core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ToolsPanelComponent } from './tools-panel/tools-panel';
import { calcGridOffset } from '@core/lib/offsets';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-build-layout',
    styleUrl: 'build-layout.scss',
    templateUrl: 'build-layout.html',
    imports: [
        CommonModule,
        GridContainerComponent,
        WidgetContainerDirective,
        CdkDrag,
        WidgetResizeHandleDirective,
        MatIconModule,
        ToolsPanelComponent,
        MatButtonModule
    ]
})
export class BuildLayoutComponent {

    gridContainer = viewChild('gridContainer', {read: GridContainerComponent});
    private readonly widgetFactory = inject(WidgetFactory);
    private readonly layoutsService = inject(LayoutsService);
    private readonly dialog = inject(MatDialog);

    displayWidgets = signal<DisplayWidget[] | undefined>(undefined);
    layout = signal<Layout>(
        this.layoutsService.getSelectedLayout()() ?? //preselected layout
        (this.layoutsService.getCustomLayouts()[0] ?? // first custom
        this.layoutsService.createDefaultLayout())); // default

    constructor() {
        this.loadWidgets(this.layout());
    }

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
        const selectedLayout = this.layout();
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
        const selectedLayout = this.layout();
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
            this.layout.set(newLayout);
            this.layoutsService.saveLayout(newLayout);
        }
    }

    onDeleteWidget(index: number) {
        const selectedLayout = this.layout();
        if (selectedLayout) {
            const newWidgets = selectedLayout.widgets.filter((_, i) => i !== index);
            const newLayout = {...selectedLayout, widgets: newWidgets};
            this.loadWidgets(newLayout);
            this.layout.set(newLayout);
            this.layoutsService.saveLayout(newLayout);
        }
    }

    onPinWidget(index: number) {
        const selectedLayout = this.layout();
        if (selectedLayout) {
            selectedLayout.widgets[index].pinned = !selectedLayout.widgets[index].pinned;
            this.updateDisplayedWidget(index, {pinned: selectedLayout.widgets[index].pinned});
            this.layoutsService.saveLayout(selectedLayout);
        }
    }

    onWidgetSettings(index: number) {
        const selectedLayout = this.layout();
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

    onLayoutSelected(id: string | undefined) {
        (id)? this.layout.set(this.layoutsService.getLayoutById(id)!)
            : this.layout.set(this.layoutsService.createDefaultLayout());
        this.loadWidgets(this.layout());
    }

}
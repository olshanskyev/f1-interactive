import { CommonModule } from '@angular/common';
import { Component, Host, inject, signal, viewChild } from '@angular/core';
import { WidgetFactory,  } from '@core/services/widget-factory';
import { GridContainerComponent, WidgetContainerDirective, WidgetResizeHandleDirective } from '@shared';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { DisplayWidget, Layout, LayoutGrids, LayoutWidget, WidgetContainer, WidgetSize, WidgetType } from '@core/types/widgets';
import { LayoutsService } from '@core';
import { MatIconModule } from '@angular/material/icon';
import { ToolsPanelComponent } from './tools-panel/tools-panel';
import { calcGridOffset } from '@core/lib/offsets';

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
        ToolsPanelComponent
    ]
})
export class BuildLayoutComponent {

    gridContainer = viewChild('gridContainer', {read: GridContainerComponent});
    private readonly widgetFactory = inject(WidgetFactory);
    private readonly layoutsService = inject(LayoutsService);

    displayWidgets = signal<DisplayWidget[] | undefined>(undefined);
    selectedLayout = signal<Layout>({
        layoutName: 'myLayout1',
        gridSize: LayoutGrids.landscape,
        widgets: []
    });

    private loadWidget(layoutWidget: LayoutWidget, index: number){
        const widget = this.widgetFactory.getWidgetByType(layoutWidget.type);
        this.displayWidgets.update(current => {
            if (!current) return current;
            const toDisplay = [...current];
            toDisplay[index] = {...layoutWidget, ...widget!};
            return toDisplay;
        });
    }

    private loadWidgets(layout: Layout) {
        const toDisplay: DisplayWidget[] = layout.widgets.map(item => {
            const widget = this.widgetFactory.getWidgetByType(item.type);
            return {...item, ...widget!};
        });
        this.displayWidgets.set(toDisplay);
    }

    constructor() {
        const preSelectedLayout = this.layoutsService.getSelectedLayout()();
        if (preSelectedLayout) {
            this.selectedLayout.set(preSelectedLayout);
            this.loadWidgets(preSelectedLayout);
        }
    }

    onUpdateWidgetView(event: {widgetIndex: number, container: WidgetContainer}) {
        this.selectedLayout().widgets[event.widgetIndex].position = event.container.position;
        this.selectedLayout().widgets[event.widgetIndex].size = event.container.size;
        this.loadWidget(this.selectedLayout().widgets[event.widgetIndex], event.widgetIndex);

    }

    onWidgetAdded(event: {widgetType: WidgetType, position: {x: number, y: number}}) {
        const grid = this.gridContainer();
        if (grid) {
            const gridOffset = calcGridOffset(grid);
            const relativeX = event.position.x - gridOffset.x;
            const relativeY = event.position.y - gridOffset.y;
            const cellSize = grid.cellSize()();

            let colStart = Math.floor(relativeX / cellSize) + 1;
            let rowStart = Math.floor(relativeY / cellSize) + 1;

            const widgetComponent = this.widgetFactory.getWidgetByType(event.widgetType);
            if (!widgetComponent) return;

            const sizeToAdd: WidgetSize = widgetComponent.defaultSizes[0];

            const maxCol = this.selectedLayout().gridSize.gridColumns - sizeToAdd.colSpan + 1;
            const maxRow = this.selectedLayout().gridSize.gridRows - sizeToAdd.rowSpan + 1;

            colStart = Math.max(1, Math.min(colStart, maxCol));
            rowStart = Math.max(1, Math.min(rowStart, maxRow));

            const layoutWidget: LayoutWidget = {
                type: event.widgetType,
                position: { colStart, rowStart },
                size: sizeToAdd,
                fixed: false
            };

            this.selectedLayout.update(layout => ({
                ...layout,
                widgets: [...layout.widgets, layoutWidget]
            }));

            this.displayWidgets.update(widgets => {
                const displayWidget: DisplayWidget = {
                    ...layoutWidget,
                    ...widgetComponent
                };
                return widgets ? [...widgets, displayWidget] : [displayWidget];
            });
        }

    }

}
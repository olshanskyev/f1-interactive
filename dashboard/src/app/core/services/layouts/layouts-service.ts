import { Injectable, signal } from '@angular/core';

import { Layout, LayoutGrids, WidgetType } from '@core/types/widgets';

@Injectable({
    providedIn: 'root'
})
export class LayoutsService {

    private selectedLayout = signal<Layout | undefined>(undefined);

    private readonly customLayout1: Layout = {
        layoutName: 'FullScreen Video FHD',
        gridSize: LayoutGrids['landscape'],
        widgets: [
            {
                type: WidgetType.VideoPlayerWidget,
                size: {colSpan: 32, rowSpan: 18},
                position: {colStart: 1, rowStart: 1},
                draggable: false,
                resizable: false
            },
            {
                type: WidgetType.SessionInfoWidget,
                position: {colStart: 2, rowStart: 3},
                size: {colSpan: 6, rowSpan: 2},
                draggable: true,
                resizable: true
            }
        ],
    };

    private readonly customLayout2:Layout = {
        layoutName: 'FullScreen Video FHD Pads',
        gridSize: LayoutGrids['landscape'],
        widgets: [
            {
                type: WidgetType.VideoPlayerWidget,
                size: {colSpan: 32, rowSpan: 18},
                position: {colStart: 1, rowStart: 1},
                draggable: false,
                resizable: false
            }
        ],
    };

    private readonly customLayout3:Layout = {
        layoutName: 'Video on TOP Mobiles',
        gridSize: LayoutGrids['mobile_portrait'],
        widgets: [
            {
                type: WidgetType.VideoPlayerWidget,
                size: {colSpan: 16, rowSpan: 9},
                position: {colStart: 1, rowStart: 1},
                draggable: false,
                resizable: false
            }
        ],
    };

    public getCustomLayouts():Layout[] {
        return [
            this.customLayout1,
            this.customLayout2,
            this.customLayout3
        ];
    }

    public selectLayout(layout: Layout | undefined) {
        this.selectedLayout.set(layout);
    }

    public selectDefaultLayout() {
        this.selectedLayout.set(undefined);
    }

    public getSelectedLayout() {
        return this.selectedLayout.asReadonly();
    }
}
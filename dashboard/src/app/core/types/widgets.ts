import { Type } from '@angular/core';

export interface WidgetPosition {colStart: number, rowStart: number}
export interface WidgetSize { colSpan: number, rowSpan: number }

export interface WidgetContainer {
    position: WidgetPosition
    size: WidgetSize
}

export interface Widget {
    type: WidgetType,
    defaultSizes: [WidgetSize | 'fullscreen'],
    widgetView: Type<any>,
    widgetPreview: Type<any>,
    widgetThumb: Type<any>
}

export interface LayoutGridSize {
        gridColumns: number,
        gridRows: number,
}

export const LayoutGrids = {
    landscape: {
        gridColumns: 32,
        gridRows: 18
    },
    mobile_portrait: {
        gridColumns: 16,
        gridRows: 38
    }
};

export enum WidgetType
{
    SessionInfoWidget = 'SessionInfoWidget',
    VideoPlayerWidget = 'VideoPlayerWidget'
}

export interface LayoutWidget {
    type: WidgetType,
    position: WidgetPosition,
    size: WidgetSize,
    draggable: boolean,
    resizable: boolean
}


export type DisplayWidget = LayoutWidget & {
    el: Type<any>,
}

export interface Layout {
    layoutName: string;
    gridSize: LayoutGridSize,
    widgets: LayoutWidget[];
}
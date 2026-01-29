import { Type } from "@angular/core";

export type WidgetPosition = {colStart: number, rowStart: number};
export type WidgetSize = { colSpan: number, rowSpan: number };

export type Widget = {
    type: WidgetType,
    defaultSizes: [WidgetSize | 'fullscreen'],
    widgetView: Type<any>,
    widgetPreview: Type<any>,
    widgetThumb: Type<any>
}

export type LayoutGridSize = {
        gridColumns: number,
        gridRows: number,
}

export const LayoutGrids = {
    'landscape': {
        gridColumns: 32,
        gridRows: 18
    },
    'mobile_portrait': {
        gridColumns: 16,
        gridRows: 38
    }
}

export enum WidgetType
{
    SessionInfoWidget = 'SessionInfoWidget',
    VideoPlayerWidget = 'VideoPlayerWidget'
}

export type LayoutWidget = {
    type: WidgetType,
    position: WidgetPosition,
    size: WidgetSize,
    draggable: boolean,
}


export type DisplayWidget = LayoutWidget & {
    el: Type<any>,
}

export type Layout = {
    layoutName: string;
    gridSize: LayoutGridSize,
    widgets: LayoutWidget[];
}
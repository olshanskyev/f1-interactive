import { Type } from '@angular/core';

export interface WidgetPosition {colStart: number, rowStart: number}
export interface WidgetSize { colSpan: number, rowSpan: number }

export interface WidgetContainer {
    position: WidgetPosition,
    size: WidgetSize,
}

export interface Widget {
    type: WidgetType,
    defaultSizes: [WidgetSize | 'fullscreen'],
    draggable: boolean,
    resizable: boolean,
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
    VideoPlayerWidget = 'VideoPlayerWidget',
    WeatherWidget = 'WeatherWidget'
}

export interface LayoutWidget {
    type: WidgetType,
    position: WidgetPosition,
    size: WidgetSize
}


export type DisplayWidget = LayoutWidget & Widget;

export interface Layout {
    layoutName: string;
    gridSize: LayoutGridSize,
    widgets: LayoutWidget[];
}
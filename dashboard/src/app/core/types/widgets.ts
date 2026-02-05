import { Type } from '@angular/core';

export interface WidgetPosition {colStart: number, rowStart: number}
export interface WidgetSize { colSpan: number, rowSpan: number }

export interface WidgetContainer {
    position: WidgetPosition,
    size: WidgetSize,
}

export interface WidgetComponent {
    type: WidgetType,
    defaultSizes: [WidgetSize],
    widgetView: Type<any>,
    widgetPreview: Type<any>,
    widgetThumb: string
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
    size: WidgetSize,
    fixed: boolean
}


export type DisplayWidget = LayoutWidget & WidgetComponent;

export interface Layout {
    layoutName: string;
    gridSize: LayoutGridSize,
    widgets: LayoutWidget[];
}
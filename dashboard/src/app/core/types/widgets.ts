import { Type } from '@angular/core';
import { TrackMapWidget } from '@shared';
import { ContaineredWidget } from '@shared/components/widgets/containered-widget';

export interface WidgetPosition {colStart: number, rowStart: number}
export interface WidgetSize { colSpan: number, rowSpan: number }

export interface WidgetContainer {
    position: WidgetPosition,
    size: WidgetSize,
}

export interface WidgetComponent {
    type: WidgetType,
    meta: WidgetMetadata,
    widgetView: Type<ContaineredWidget>,
    widgetThumb: string
}

export interface LayoutGridSize {
        gridColumns: number,
        gridRows: number,
}

export const LayoutGrids = {
    landscape: {
        gridColumns: 64,
        gridRows: 36
    },
    mobile_portrait: {
        gridColumns: 24,
        gridRows: 57
    }
};

export enum WidgetType
{
    SessionInfoWidget = 'SessionInfoWidget',
    VideoPlayerWidget = 'VideoPlayerWidget',
    WeatherWidget = 'WeatherWidget',
    LeaderboardWidget = 'LeaderboardWidget',
    TrackMapWidget = 'TrackMapWidget',
}

export type SettingType = 'string' | 'number' | 'boolean' | string[];
export interface WidgetSetting {type: SettingType, defaultValue?: any}
export type WidgetSettings = Record<string, WidgetSetting>;

export interface LayoutWidget {
    type: WidgetType,
    position: WidgetPosition,
    size: WidgetSize,
    pinned: boolean,
    settings?: Record<string, any>,
}


export type DisplayWidget = LayoutWidget & WidgetComponent;

export interface Layout {
    id: string;
    layoutName: string;
    gridSize: LayoutGridSize,
    widgets: LayoutWidget[];
}

export interface WidgetMetadata {
    settingsList: WidgetSettings;
    defaultSizes: WidgetSize[];
}
import { Type } from '@angular/core';
import { Leaderboard } from '@shared';
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
    widgetPreview: Type<any>,
    widgetThumb: string
}

export interface LayoutGridSize {
        gridColumns: number,
        gridRows: number,
}

export const LayoutGrids = {
    landscape: {
        gridColumns: 48,
        gridRows: 27
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
    WeatherWidget = 'WeatherWidget',
    LeaderboardWidget = 'LeaderboardWidget'
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
import { Type } from '@angular/core';
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

export interface LayoutGrid {
        fixedRatio: boolean,
        ratio?: string,
        fixedWidth: boolean,
        rows?: number,
        columns?: number
}

export const Ratio = {
    landscape: '16x9',
};

export const DEFAULT_CELL_SIZE = 20;

export const LayoutGrids: Record<string, LayoutGrid> = {
    landscape: {
        fixedRatio: true,
        ratio: Ratio.landscape,
        fixedWidth: false
    },
    portrait: {
        fixedRatio: false,
        fixedWidth: true
    }
};

export enum WidgetType
{
    SessionInfoWidget = 'SessionInfoWidget',
    VideoPlayerWidget = 'VideoPlayerWidget',
    WeatherWidget = 'WeatherWidget',
    LeaderboardWidget = 'LeaderboardWidget',
    TrackMapWidget = 'TrackMapWidget',
    RaceControlMessagesWidget = 'RaceControlMessagesWidget',
    TeamRadioWidget = 'TeamRadioWidget',
    HeadToHeadWidget = 'HeadToHeadWidget',
}

export enum VideoSource {
    VK = 'VK',
    YouTube = 'YouTube'
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
    grid: LayoutGrid,
    widgets: LayoutWidget[];
}

export interface WidgetMetadata {
    settingsList: WidgetSettings;
    defaultSizes: {width: number, height: number}[];
}
import { Injectable } from '@angular/core';
import { WidgetComponent, WidgetType } from '@core/types/widgets';
import { Leaderboard, LeaderboardWidgetPreview, SessionInfoWidget, VideoPlayerWidget, WeatherWidget, WeatherWidgetPreview } from '@shared';
import { SessionInfoWidgetPreview } from '@shared/components/widgets/session-info/preview/session-info-widget-preview';
import { VideoPlayerWidgetPreview } from '@shared/components/widgets/video/preview/video-player-widget-preview';

@Injectable({
    providedIn: 'root'
})
export class WidgetFactory {

    private widgets = new Map<WidgetType, WidgetComponent>([
        [WidgetType.VideoPlayerWidget, {
            type: WidgetType.VideoPlayerWidget,
            meta : {
                settingsList: {
                    source: {type: ['VK','YouYube'], defaultValue: 'VK'},
                    embedCode: {type: 'string'},
                },
                defaultSizes: [{colSpan: 16, rowSpan: 9}],
            },
            widgetView: VideoPlayerWidget,
            widgetPreview: VideoPlayerWidgetPreview,
            widgetThumb: 'images/thumbs/video-player-widget-thumb.png',
        }],
        [WidgetType.LeaderboardWidget, {
            type: WidgetType.LeaderboardWidget,
            meta : {
                settingsList: {
                    showHeader: {type: 'boolean', defaultValue: true},
                    mode: {type: ['all', 'laps', 'sectors', 'speeds', 'tyres'], defaultValue: 'all'},
                },
                defaultSizes: [{colSpan: 16, rowSpan: 9}],
            },
            widgetView: Leaderboard,
            widgetPreview: LeaderboardWidgetPreview,
            widgetThumb: 'images/thumbs/leaderboard-widget-thumb.png',
        }],
        [WidgetType.SessionInfoWidget, {
            type: WidgetType.SessionInfoWidget,
            meta : {
                settingsList: {},
                defaultSizes: [{colSpan: 14, rowSpan: 4}],
            },
            widgetView: SessionInfoWidget,
            widgetPreview: SessionInfoWidgetPreview,
            widgetThumb: 'images/thumbs/session-info-widget-thumb.png',
        }],
        [WidgetType.WeatherWidget, {
            type: WidgetType.WeatherWidget,
            meta : {
                settingsList: {
                    airTemp: {type: 'boolean', defaultValue: true},
                    trackTemp: {type: 'boolean', defaultValue: true},
                    condition: {type: 'boolean', defaultValue: true},
                    humidity: {type: 'boolean', defaultValue: true},
                    pressure: {type: 'boolean', defaultValue: true},
                    wind: {type: 'boolean', defaultValue: true}
                },
                defaultSizes: [{colSpan: 14, rowSpan: 2}],
            },
            widgetView: WeatherWidget,
            widgetPreview: WeatherWidgetPreview,
            widgetThumb: 'images/thumbs/weather-widget-thumb.png',
        }],
    ]);

    getWidgets(): Map<WidgetType, WidgetComponent> {
        return this.widgets;
    }

    getWidgetByType(type: WidgetType) {
        return this.widgets.get(type);
    }
}
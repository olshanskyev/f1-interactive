import { Injectable } from '@angular/core';
import { WidgetComponent, WidgetType } from '@core/types/widgets';
import { Leaderboard, SessionInfoWidget, VideoPlayerWidget, WeatherWidget } from '@shared';

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
            widgetThumb: 'images/thumbs/leaderboard-widget-thumb.png',
        }],
        [WidgetType.SessionInfoWidget, {
            type: WidgetType.SessionInfoWidget,
            meta : {
                settingsList: {},
                defaultSizes: [{colSpan: 14, rowSpan: 4}],
            },
            widgetView: SessionInfoWidget,
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
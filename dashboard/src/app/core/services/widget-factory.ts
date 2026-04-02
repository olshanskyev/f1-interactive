import { Injectable } from '@angular/core';
import { WidgetComponent, WidgetType } from '@core/types/widgets';
import { Leaderboard, RaceControlMessagesWidget, SessionInfoWidget, TeamRadioWidget, TrackMapWidget, VideoPlayerWidget, WeatherWidget } from '@shared';

@Injectable({
    providedIn: 'root'
})
export class WidgetFactory {

    private widgets = new Map<WidgetType, WidgetComponent>([
        [WidgetType.VideoPlayerWidget, {
            type: WidgetType.VideoPlayerWidget,
            meta : {
                settingsList: {
                    source: {type: ['VK'/*,'YouYube'*/], defaultValue: 'VK'},
                    embedCode: {type: 'string'},
                },
                defaultSizes: [{width: 380, height: 200}],
            },
            widgetView: VideoPlayerWidget,
            widgetThumb: 'images/thumbs/video-player-widget-thumb.png',
        }],
        [WidgetType.TrackMapWidget, {
            type: WidgetType.TrackMapWidget,
            meta : {
                settingsList: {

                },
                defaultSizes: [{width: 380, height: 300}],
            },
            widgetView: TrackMapWidget,
            widgetThumb: 'images/thumbs/track-map-widget-thumb.png',
        }],
        [WidgetType.LeaderboardWidget, {
            type: WidgetType.LeaderboardWidget,
            meta : {
                settingsList: {
                    showHeader: {type: 'boolean', defaultValue: true},
                    mode: {type: ['all', 'laps', 'sectors', 'speeds', 'tyres'], defaultValue: 'all'},
                },
                defaultSizes: [{width: 380, height: 600}],
            },
            widgetView: Leaderboard,
            widgetThumb: 'images/thumbs/leaderboard-widget-thumb.png',
        }],
        [WidgetType.SessionInfoWidget, {
            type: WidgetType.SessionInfoWidget,
            meta : {
                settingsList: {},
                defaultSizes: [{width: 380, height: 160}],
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
                defaultSizes: [{width: 300, height: 100}],
            },
            widgetView: WeatherWidget,
            widgetThumb: 'images/thumbs/weather-widget-thumb.png',
        }],
        [WidgetType.RaceControlMessagesWidget, {
            type: WidgetType.RaceControlMessagesWidget,
            meta: {
                settingsList: {},
                defaultSizes: [{width: 380, height: 400}],
            },
            widgetView: RaceControlMessagesWidget,
            widgetThumb: 'images/thumbs/race-control-messages-widget-thumb.png',
        }],
        [WidgetType.TeamRadioWidget, {
            type: WidgetType.TeamRadioWidget,
            meta: {
                settingsList: {},
                defaultSizes: [{width: 380, height: 400}],
            },
            widgetView: TeamRadioWidget,
            widgetThumb: 'images/thumbs/team-radio-widget-thumb.png',
        }],
    ]);

    getWidgets(): Map<WidgetType, WidgetComponent> {
        return this.widgets;
    }

    getWidgetByType(type: WidgetType) {
        return this.widgets.get(type);
    }
}
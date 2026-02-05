import { Injectable } from '@angular/core';
import { WidgetComponent, WidgetType } from '@core/types/widgets';
import { SessionInfoWidget, VideoPlayerWidget, WeatherWidget, WeatherWidgetPreview } from '@shared';
import { SessionInfoWidgetPreview } from '@shared/components/widgets/session-info/preview/session-info-widget-preview';
import { VideoPlayerWidgetPreview } from '@shared/components/widgets/video/preview/video-player-widget-preview';

@Injectable({
    providedIn: 'root'
})
export class WidgetFactory {

    private widgets = new Map<WidgetType, WidgetComponent>([
        [WidgetType.VideoPlayerWidget, {
            type: WidgetType.VideoPlayerWidget,
            defaultSizes: [{colSpan: 16, rowSpan: 9}],
            widgetView: VideoPlayerWidget,
            widgetPreview: VideoPlayerWidgetPreview,
            widgetThumb: 'images/thumbs/video-player-widget-thumb.png',
        }],
        [WidgetType.SessionInfoWidget, {
            type: WidgetType.SessionInfoWidget,
            defaultSizes: [{colSpan: 6, rowSpan: 2}],
            widgetView: SessionInfoWidget,
            widgetPreview: SessionInfoWidgetPreview,
            widgetThumb: 'images/thumbs/weather-widget-thumb.png',
        }],
        [WidgetType.WeatherWidget, {
            type: WidgetType.WeatherWidget,
            defaultSizes: [{colSpan: 14, rowSpan: 2}],
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
import { Injectable } from '@angular/core';
import { WidgetComponent, WidgetType } from '@core/types/widgets';
import { SessionInfoWidget, SessionInfoWidgetThumb, VideoPlayerWidget, WeatherWidget, WeatherWidgetPreview, WeatherWidgetThumb } from '@shared';
import { SessionInfoWidgetPreview } from '@shared/components/widgets/session-info/preview/session-info-widget-preview';
import { VideoPlayerWidgetPreview } from '@shared/components/widgets/video/preview/video-player-widget-preview';
import { VideoPlayerWidgetThumb } from '@shared/components/widgets/video/thumb/video-player-widget-thumb';

@Injectable({
    providedIn: 'root'
})
export class WidgetFactory {

    private widgets = new Map<WidgetType, WidgetComponent>([
        [WidgetType.VideoPlayerWidget, {
            type: WidgetType.VideoPlayerWidget,
            defaultSizes: ['fullscreen'],
            widgetView: VideoPlayerWidget,
            widgetPreview: VideoPlayerWidgetPreview,
            widgetThumb: VideoPlayerWidgetThumb,
        }],
        [WidgetType.SessionInfoWidget, {
            type: WidgetType.SessionInfoWidget,
            defaultSizes: [{colSpan: 6, rowSpan: 2}],
            widgetView: SessionInfoWidget,
            widgetPreview: SessionInfoWidgetPreview,
            widgetThumb: SessionInfoWidgetThumb
        }],
        [WidgetType.WeatherWidget, {
            type: WidgetType.WeatherWidget,
            defaultSizes: [{colSpan: 14, rowSpan: 2}],
            widgetView: WeatherWidget,
            widgetPreview: WeatherWidgetPreview,
            widgetThumb: WeatherWidgetThumb
        }],
    ]);

    getWidgets(): Map<WidgetType, WidgetComponent> {
        return this.widgets;
    }

    getWidgetByType(type: WidgetType) {
        return this.widgets.get(type);
    }
}
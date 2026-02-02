import { Injectable } from '@angular/core';
import { Widget, WidgetType } from '@core/types/widgets';
import { SessionInfoWidget, SessionInfoWidgetThumb, VideoPlayerWidget, WeatherWidget, WeatherWidgetPreview, WeatherWidgetThumb } from '@shared';
import { SessionInfoWidgetPreview } from '@shared/components/widgets/session-info/preview/session-info-widget-preview';
import { VideoPlayerWidgetPreview } from '@shared/components/widgets/video/preview/video-player-widget-preview';
import { VideoPlayerWidgetThumb } from '@shared/components/widgets/video/thumb/video-player-widget-thumb';

@Injectable({
    providedIn: 'root'
})
export class WidgetFactory {

    private widgets = new Map<WidgetType, Widget>([
        [WidgetType.VideoPlayerWidget, {
            type: WidgetType.VideoPlayerWidget,
            defaultSizes: ['fullscreen'],
            draggable: false,
            resizable: false,
            widgetView: VideoPlayerWidget,
            widgetPreview: VideoPlayerWidgetPreview,
            widgetThumb: VideoPlayerWidgetThumb,
        }],
        [WidgetType.SessionInfoWidget, {
            type: WidgetType.SessionInfoWidget,
            draggable: true,
            resizable: true,
            defaultSizes: [{colSpan: 6, rowSpan: 2}],
            widgetView: SessionInfoWidget,
            widgetPreview: SessionInfoWidgetPreview,
            widgetThumb: SessionInfoWidgetThumb
        }],
        [WidgetType.WeatherWidget, {
            type: WidgetType.WeatherWidget,
            draggable: true,
            resizable: true,
            defaultSizes: [{colSpan: 14, rowSpan: 2}],
            widgetView: WeatherWidget,
            widgetPreview: WeatherWidgetPreview,
            widgetThumb: WeatherWidgetThumb
        }],
    ]);

    getWidgets(): Map<WidgetType, Widget> {
        return this.widgets;
    }

    getWidgetByType(type: WidgetType) {
        return this.widgets.get(type);
    }
}
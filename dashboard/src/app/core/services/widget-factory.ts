import { Injectable, Type } from '@angular/core';
import { Widget, WidgetType } from '@core/types/widgets';
import { SessionInfoWidget, SessionInfoWidgetThumb, VideoPlayerWidget } from '@shared';
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
    ]);

    getWidgets(): Map<WidgetType, Widget> {
        return this.widgets;
    }

    getWidgetByType(type: WidgetType) {
        return this.widgets.get(type);
    }
}
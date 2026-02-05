import { Directive, inject } from '@angular/core';
import { LiveService } from '@core';
import { WidgetContainerDirective } from '@shared';

@Directive()
export abstract class Widget {
    liveService = inject(LiveService);
    container = inject(WidgetContainerDirective, {optional: true});
    dynamicHeight = this.container?.height();

    abstract get defaultHeight(): number;
}
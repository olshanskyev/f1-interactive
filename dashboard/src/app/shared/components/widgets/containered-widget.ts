import { Directive, inject, input } from '@angular/core';
import { LiveService } from '@core/services/live/live.service';
import { WidgetContainerDirective } from '@shared';

@Directive()
export abstract class ContaineredWidget{
    liveService = inject(LiveService);
    container = inject(WidgetContainerDirective, {optional: true});
    dynamicHeight = this.container?.height();
    settings = input<Record<string, any>>();
}
import { Component } from '@angular/core';
import { ContaineredWidget } from '../../containered-widget';

@Component({
    selector: 'session-info-widget-preview',
    imports: [

    ],
    template: `
        <div class="widget-preview-container">SessionInfoPreview</div>
    `
})
export class SessionInfoWidgetPreview extends ContaineredWidget {

}
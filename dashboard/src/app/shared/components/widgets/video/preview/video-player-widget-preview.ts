import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'video-player-widget-preview',
    imports: [
        MatIconModule
    ],
    template: `
        <div class="h-full bg-color-inactive d-flex justify-content-center dynamic-header-size">
                <h1 class="d-flex align-items-center gap-8">
                    <mat-icon>video_camera_back</mat-icon>
                    Video
                </h1>
        </div>
    `
})
export class VideoPlayerWidgetPreview {

}
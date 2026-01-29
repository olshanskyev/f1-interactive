import { Component } from "@angular/core";
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: 'video-player-widget-thumb',
    imports: [
       MatCardModule,
       MatIconModule
    ],
    template: `
         <div class="h-full">
            <mat-card class='h-full'>
                <mat-card-content class='h-full d-flex justify-content-center align-items-center'>
                    <mat-icon>aspect_ratio</mat-icon>
                    <span class="m-l-4">Full Screen Video</span>
                </mat-card-content>
            </mat-card>
        </div>
    `
})
export class VideoPlayerWidgetThumb {

}
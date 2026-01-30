import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'session-info-widget-thumb',
    imports: [
       MatCardModule
    ],
    template: `
         <div class="h-full">
            <mat-card class='h-full'>
                <mat-card-content class='h-full align-content-center text-center'>
                    Session Info
                </mat-card-content>
            </mat-card>
        </div>
    `
})
export class SessionInfoWidgetThumb {

}
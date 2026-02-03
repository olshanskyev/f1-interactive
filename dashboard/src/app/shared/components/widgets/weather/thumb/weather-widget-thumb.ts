import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'weather-widget-thumb',
    imports: [
       MatCardModule,
       MatIconModule
    ],
    template: `
         <div class="h-full">
            <mat-card class='h-full'>
                <mat-card-content class='h-full d-flex justify-content-center align-items-center'>
                    <mat-icon>wb_sunny</mat-icon>
                    <span class="m-l-4">Weather</span>
                </mat-card-content>
            </mat-card>
        </div>
    `
})
export class WeatherWidgetThumb {

}

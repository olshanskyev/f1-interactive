import { Component} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { WeatherWidget } from '../weather-widget';
import { WeatherData } from '@core/types/f1types';


@Component({
    selector: 'weather-widget-preview',
    imports: [
        MatIconModule,
        WeatherWidget
    ],
    template: `
        <div class="widget-preview-container">
                <weather-widget [weatherData]="weatherData" />
        </div>
    `
})
export class WeatherWidgetPreview {
    weatherData: WeatherData = {
        AirTemp: '22',
        TrackTemp: '20',
        Rainfall: '0',
        Humidity: '60',
        Pressure: '1013',
        WindSpeed: '5',
        WindDirection: '91'
    };
}

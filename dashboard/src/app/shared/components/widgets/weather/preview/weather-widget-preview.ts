import { Component, signal, Injectable } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { WeatherWidget } from '../weather-widget';
import { WeatherData } from '@core/types/f1types';
import { ContaineredWidget } from '../../containered-widget';
import { LiveService } from '@core/services/live/live.service';

@Injectable()
class MockLiveService {
    weatherData = signal<WeatherData>({
        AirTemp: '22',
        TrackTemp: '20',
        Rainfall: '0',
        Humidity: '60',
        Pressure: '1013',
        WindSpeed: '5',
        WindDirection: '91'
    });
    getWeatherDataSignal() {
        return this.weatherData;
    }
}

@Component({
    selector: 'weather-widget-preview',
    imports: [
        MatIconModule,
        WeatherWidget
    ],
    providers: [
        { provide: LiveService, useClass: MockLiveService }
    ],
    template: `
        <div class="widget-preview-container">
                <weather-widget [settings]="settings()"/>
        </div>
    `
})
export class WeatherWidgetPreview extends ContaineredWidget {
}

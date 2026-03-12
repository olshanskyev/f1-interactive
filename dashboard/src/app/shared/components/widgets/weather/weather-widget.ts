import { Component, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  CarouselContainerDirective, CarouselItemDirective, CarouselTrackDirective,
} from '@shared/directives';
import { ContaineredWidget } from '../containered-widget';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'weather-widget',
  templateUrl: './weather-widget.html',
  styleUrl: './weather-widget.scss',
  host: {
        '[style.--dynamic-height.px]': '(dynamicHeight && dynamicHeight() > 0)? dynamicHeight() : defaultHeight',
        '[style.--default-height.px]': 'defaultHeight',
  },
  imports: [
    MatIconModule,
    CarouselTrackDirective,
    CarouselContainerDirective,
    CarouselItemDirective,
    TranslateModule
  ],
})
export class WeatherWidget extends ContaineredWidget {

  readonly defaultHeight = 45;
  weatherData = this.liveService.getWeatherDataSignal();

  conditionIcon = computed(() => {
    return (Number(this.weatherData()?.Rainfall)) ? 'rainy' : 'sunny';
  });

  condition = computed(() => {
    return (Number(this.weatherData()?.Rainfall)) ? 'weather.rain' : 'weather.no_rain';
  });

  windDirection = computed(() => {
    // convert wind direction for example from 84 into NE 84°
    const deg = Number(this.weatherData()?.WindDirection);
    if (isNaN(deg)) return;
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
    const idx = Math.round(deg / 45) % 8;
    return `${directions[idx]} ${deg}°`;
  });

}

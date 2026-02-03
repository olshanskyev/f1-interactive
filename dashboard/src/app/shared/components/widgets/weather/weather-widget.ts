import { AfterViewInit, Component, effect, Host, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { WeatherData } from '@core/types/f1types';
import { CarouselContainerDirective, CarouselItemDirective, CarouselTrackDirective, WidgetContainerDirective } from '@shared/directives';



@Component({
  selector: 'weather-widget',
  templateUrl: './weather-widget.html',
  styleUrl: './weather-widget.scss',
  imports: [
    MatIconModule,
    CarouselTrackDirective,
    CarouselContainerDirective,
    CarouselItemDirective
  ],
})
export class WeatherWidget {

  @Host() container = inject(WidgetContainerDirective);
  height = this.container.height();

  weatherData = input<WeatherData>();

  conditionIcon() {
    return (Number(this.weatherData()?.Rainfall)) ? 'rainy' : 'sunny';
  }

  condition() {
    return (Number(this.weatherData()?.Rainfall)) ? 'Rain' : 'No rain';
  }

  windDirection() {
    // convert wind direction for example from 84 into NE 84°
    const deg = Number(this.weatherData()?.WindDirection);
    if (!deg) return;
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
    const idx = Math.round(deg / 45) % 8;
    return `${directions[idx]} ${deg}°`;
  }

}

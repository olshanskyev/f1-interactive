import { Component, input } from '@angular/core';
import { DriverListItem } from '@core/types/f1types';

@Component({
  selector: 'simple-driver-card',
  templateUrl: './simple-driver-card.html',
  styleUrl: './simple-driver-card.scss',
})
export class SimpleDriverCard {
  readonly driver = input.required<DriverListItem>();
  readonly position = input<number>(0);
}
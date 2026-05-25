import { Component, computed, input } from '@angular/core';
import { getDriverPhotoByTLA } from '@core/lib/drivers';
import { DriverListItem } from '@core/types/f1types';

@Component({
  selector: 'simple-driver-card',
  templateUrl: './simple-driver-card.html',
  styleUrl: './simple-driver-card.scss',
})
export class SimpleDriverCard {
  readonly driver = input.required<DriverListItem>();
  readonly position = input<number>(0);

  photoUrl = computed(() => {
    const src = getDriverPhotoByTLA(this.driver().Tla);
    return (!src) ? this.driver().HeadshotUrl: src;
  });
}
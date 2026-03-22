import { Component, input } from '@angular/core';
import { DriverListItem } from '@core/types/f1types';

@Component({
  selector: 'simple-driver-card',
  template: `
    <div class="d-flex flex-row gap-8">
        <img class="photo"
          [alt]="driver().BroadcastName"
          [src]="driver().HeadshotUrl"
          [style.background-color]="'#' + driver().TeamColour + '20'"
          [style.border-color]="'#' + driver().TeamColour"
        />
      <div class="d-flex flex-col justify-content-center">
        <div class="f-s-14">
          {{driver().FirstName}} {{driver().LastName}}
        </div>
        <div class="f-s-12 text-color-second">
          {{driver().TeamName}}
        </div>
      </div>
    </div>
  `,
  styles: `
    .photo {
      aspect-ratio: 1;
      object-fit: cover;
      height: 3.5rem;
      border: 1px solid;
      border-radius: 0.5rem;
    }
  `,
})
export class SimpleDriverCard {
  readonly driver = input.required<DriverListItem>();
}
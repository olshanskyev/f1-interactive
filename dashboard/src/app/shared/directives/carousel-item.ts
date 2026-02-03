import { Directive } from '@angular/core';

@Directive({
  selector: '[carouselItem]',
  standalone: true,
  host: {
    style: 'display: flex; flex: 0 0 auto;',
  },
})
export class CarouselItemDirective {

}
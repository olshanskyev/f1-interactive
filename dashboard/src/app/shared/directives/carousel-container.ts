import { AfterViewInit, ContentChild, Directive, ElementRef, OnDestroy } from '@angular/core';
import { CarouselTrackDirective } from './carousel-track';

@Directive({
  selector: '[carouselContainer]',
  standalone: true,
  host: {
    'style': 'position: relative; overflow-x: hidden; overflow-y: hidden;',
  },
})
export class CarouselContainerDirective implements AfterViewInit, OnDestroy {
  @ContentChild(CarouselTrackDirective) track!: CarouselTrackDirective;

  private resizeObserver: ResizeObserver | null = null;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit() {
    this.startCarouselIfNeeded();
    this.resizeObserver = new ResizeObserver(() => {
      this.track?.stopAnimation();
      this.startCarouselIfNeeded();
    });
    this.resizeObserver.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.track?.stopAnimation();
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private startCarouselIfNeeded() {
    const container = this.el.nativeElement;
    const trackEl = this.track?.elementRef.nativeElement;
    if (!trackEl) return;

    if (trackEl.scrollWidth > container.clientWidth) {
      this.track.startAnimation(container.clientWidth);
    } else {
      trackEl.style.transform = 'translateX(0)';
    }
  }
}

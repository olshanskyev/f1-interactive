import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[carouselTrack]',
  standalone: true,
  host: {
    'style': 'display: flex; transition: transform 0.2s linear; will-change: transform;',
  },
})
export class CarouselTrackDirective {
  @Input() speed = 0.4; // px per frame
  @Input() pauseDuration = 1000; // ms to pause at start

  private animationFrame: number | null = null;
  private pauseTimeout: any = null; // <-- add this
  private scrollPos = 0;
  private containerWidth = 0;

  constructor(public elementRef: ElementRef<HTMLElement>) {}

  startAnimation(containerWidth: number) {
    this.containerWidth = containerWidth;
    this.scrollPos = 0;
    this.elementRef.nativeElement.style.transform = 'translateX(0)';
    this.animate();
  }

  stopAnimation() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    if (this.pauseTimeout) {
      clearTimeout(this.pauseTimeout);
      this.pauseTimeout = null;
    }
    this.scrollPos = 0;
  }

  private animate = () => {
    const track = this.elementRef.nativeElement;
    const maxScroll = track.scrollWidth - this.containerWidth;

    // If no longer overflowing, stop animation and reset transform
    if (maxScroll <= 0) {
      this.stopAnimation();
      track.style.transform = 'translateX(0)';
      return;
    }

    this.scrollPos += this.speed;
    if (this.scrollPos > maxScroll) {
      this.scrollPos = 0;
      track.style.transform = 'translateX(0)';
      // Pause before starting again
      this.pauseTimeout = setTimeout(() => {
        this.animationFrame = requestAnimationFrame(this.animate);
        this.pauseTimeout = null;
      }, this.pauseDuration);
      return;
    }
    track.style.transform = `translateX(-${this.scrollPos}px)`;
    this.animationFrame = requestAnimationFrame(this.animate);
  };
}

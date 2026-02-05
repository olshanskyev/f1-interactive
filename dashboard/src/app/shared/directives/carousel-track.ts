import { AfterViewInit, Directive, ElementRef, inject, Input } from '@angular/core';

@Directive({
  selector: '[carouselTrack]',
  standalone: true,
  host: {
    style: 'display: flex; will-change: transform;',
  },
})
export class CarouselTrackDirective implements AfterViewInit {
  @Input() speed = 0.4; // px per frame
  @Input() loopPauseMs = 0; // pause duration in ms, configurable

  private animationFrame: number | null = null;
  private scrollPos = 0;
  private isPaused = false;
  private gap = 0;
  private originalOrder: HTMLElement[] = [];

  public elementRef = inject(ElementRef<HTMLElement>);
  constructor() {}

  ngAfterViewInit() {
    const style = window.getComputedStyle(this.elementRef.nativeElement);
    const gapValue = style.gap || style.columnGap || '0px';
    this.gap = parseFloat(gapValue);
    // Store the original order of elements
    this.originalOrder = Array.from(this.elementRef.nativeElement.children) as HTMLElement[];
  }

  startAnimation() {
    this.animate();
  }

  stopAnimation() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    this.scrollPos = 0;
    this.elementRef.nativeElement.style.transform = 'translateX(0)';
    // Restore the original order
    const track = this.elementRef.nativeElement;
    this.originalOrder.forEach(el => {
      if (track.contains(el)) {
        track.appendChild(el);
      }
    });
  }





  private animate = () => {
    if (this.isPaused) return;

    const track = this.elementRef.nativeElement;
    const firstChild = track.firstElementChild as HTMLElement;
    if (!firstChild) return;
    const firstChildWidth = firstChild.offsetWidth + this.gap;

    this.scrollPos += this.speed;
    if (this.scrollPos >= firstChildWidth) {
      // Move the first child to the end
      track.appendChild(firstChild);
      this.scrollPos -= firstChildWidth;
      this.isPaused = true;
      setTimeout(() => {
        this.isPaused = false;
        this.animationFrame = requestAnimationFrame(this.animate);
      }, this.loopPauseMs);
      this.elementRef.nativeElement.style.transform = `translateX(-${Math.floor(this.scrollPos)}px)`;
      return;
    }
    this.elementRef.nativeElement.style.transform = `translateX(-${Math.floor(this.scrollPos)}px)`;
    this.animationFrame = requestAnimationFrame(this.animate);
  };
}

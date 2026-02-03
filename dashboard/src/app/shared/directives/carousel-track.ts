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
  private contentWidth = 0;
  private isCloned = false;
  private originalContent: HTMLElement[] = [];
  private isPaused = false;
  private gap = 0;

  public elementRef = inject(ElementRef<HTMLElement>);
  constructor() {}

  ngAfterViewInit() {
    const style = window.getComputedStyle(this.elementRef.nativeElement);
    const gapValue = style.gap || style.columnGap || '0px';
    this.gap = parseFloat(gapValue);
    this.contentWidth = this.elementRef.nativeElement.scrollWidth;
    this.originalContent = (Array.from(this.elementRef.nativeElement.children) as HTMLElement[])
      .map(child => child.cloneNode(true) as HTMLElement);
  }

  startAnimation() {
    if (!this.isCloned) {
      this.cloneTrackContent();
      this.isCloned = true;
    }
    this.animate();
  }

  stopAnimation() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    this.scrollPos = 0;
    this.elementRef.nativeElement.style.transform = 'translateX(0)';
    this.restoreOriginalContent();
  }

  private restoreOriginalContent() {
    const track = this.elementRef.nativeElement;
    while (track.firstChild) {
      track.removeChild(track.firstChild);
    }
    this.originalContent.forEach(child => track.appendChild(child));
    this.isCloned = false;
  }

  private cloneTrackContent() {
    const track = this.elementRef.nativeElement;
    const children = Array.from(track.children);
    children.forEach((child: any) => {
      const clone = child.cloneNode(true);
      track.appendChild(clone);
    });
  }

  private animate = () => {
    if (this.isPaused) return;

    this.scrollPos += this.speed;
    if (this.scrollPos >= this.contentWidth + this.gap) {
      this.scrollPos = 0;
      this.isPaused = true;
      setTimeout(() => {
        this.isPaused = false;
        this.animationFrame = requestAnimationFrame(this.animate);
      }, this.loopPauseMs);
      this.elementRef.nativeElement.style.transform = `translateX(0px)`;
      return;
    }
    this.elementRef.nativeElement.style.transform = `translateX(-${Math.floor(this.scrollPos)}px)`;
    this.animationFrame = requestAnimationFrame(this.animate);
  };
}

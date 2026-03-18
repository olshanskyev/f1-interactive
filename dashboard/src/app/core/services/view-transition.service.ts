import { Injectable, ApplicationRef, inject } from '@angular/core';

interface PendingTransition {
  callback: () => void;
  resolve: () => void;
}

/**
 * FLIP animation service
 */
@Injectable({ providedIn: 'root' })
export class ViewTransitionService {
  private pendingCallbacks: PendingTransition[] = [];
  private flushScheduled = false;
  private isTransitioning = false;
  private appRef = inject(ApplicationRef);

  requestTransition(callback: () => void): Promise<void> {
    return new Promise<void>((resolve) => {
      this.pendingCallbacks.push({ callback, resolve });
      this.scheduleFlush();
    });
  }

  private scheduleFlush(): void {
    if (this.flushScheduled || this.isTransitioning) {
      return;
    }
    this.flushScheduled = true;
    queueMicrotask(() => {
      this.flushScheduled = false;
      this.flush();
    });
  }

  private flush(): void {
    if (this.pendingCallbacks.length === 0 || this.isTransitioning) {
      return;
    }

    this.isTransitioning = true;
    const batch = this.pendingCallbacks;
    this.pendingCallbacks = [];

    // 1. FIRST: Record initial bounding boxes of elements we want to animate
    const elements = Array.from(document.querySelectorAll('.transition-container')) as HTMLElement[];
    const firstRects = new Map<HTMLElement, DOMRect>();
    elements.forEach(el => firstRects.set(el, el.getBoundingClientRect()));

    // Execute state updates
    for (const item of batch) {
      item.callback();
    }

    // Force Angular change detection to update the DOM immediately
    this.appRef.tick();

    // 2. LAST & INVERT: Read new positions and apply inverse transform
    const animatedElements: HTMLElement[] = [];

    firstRects.forEach((firstRect, el) => {
      // If the element is still in the DOM
      if (document.body.contains(el)) {
        const lastRect = el.getBoundingClientRect();
        const deltaX = firstRect.left - lastRect.left;
        const deltaY = firstRect.top - lastRect.top;

        if (deltaX !== 0 || deltaY !== 0) {
          animatedElements.push(el);
          el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
          el.style.transition = 'none'; // Disable transition for instant revert
          // Ensure elements moving UP (positive delta) stay on top of elements moving DOWN
          el.style.position = 'relative';
          el.style.zIndex = deltaY > 0 ? '2' : '1';
        }
      }
    });

    // Force style recalculation (reflow)
    document.body.offsetHeight;

    // 3. PLAY: Run the animation to the new positions
    animatedElements.forEach((el) => {
      el.style.transition = 'transform 1s ease-out';
      el.style.transform = ''; // Removes inline style to transform back to 0
    });

    // Resolve after the animation completes
    setTimeout(() => {
      animatedElements.forEach((el) => {
        el.style.transition = ''; // Clean up
        el.style.position = '';
        el.style.zIndex = '';
      });

      this.isTransitioning = false;
      for (const item of batch) {
        item.resolve();
      }

      if (this.pendingCallbacks.length > 0) {
        this.scheduleFlush();
      }
    }, 1000);
  }
}

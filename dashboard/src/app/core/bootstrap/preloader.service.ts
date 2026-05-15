import { Injectable, inject, DOCUMENT } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PreloaderService {
  private readonly document = inject(DOCUMENT);

  private readonly selector = 'globalLoader';

  private getElement() {
    return this.document.getElementById(this.selector);
  }

  hide() {
    const el = this.getElement();
    if (el) {
      const onTransitionEnd = () => {
        el.classList.remove('global-loader-fade-out');
        el.classList.add('global-loader-hidden');
        el.style.pointerEvents = '';
        el.removeEventListener('transitionend', onTransitionEnd);
        clearTimeout(fallbackTimeout);
      };

      el.style.pointerEvents = 'none';
      el.addEventListener('transitionend', onTransitionEnd);

      if (!el.classList.contains('global-loader-fade-out') && !el.classList.contains('global-loader-hidden')) {
        el.classList.add('global-loader-fade-out');
      }

      // Fallback in case transitionend doesn't fire (e.g., interrupted navigation)
      const fallbackTimeout = window.setTimeout(onTransitionEnd, 1000);
    }
  }
}

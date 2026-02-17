import { Injectable } from '@angular/core';

interface PendingTransition {
  callback: () => void;
  resolve: () => void;
}

/**
 * Centralized service for coordinating View Transitions across multiple components.
 *
 * The browser's `document.startViewTransition()` API only supports one active
 * transition at a time. This service batches all transition requests from the
 * same microtask into a single `startViewTransition()` call, ensuring that
 * multiple widgets (e.g. several leaderboard tables) animate simultaneously.
 *
 * If a transition is already in progress, new requests are queued and executed
 * as a batch once the current transition completes.
 */
@Injectable({ providedIn: 'root' })
export class ViewTransitionService {
  private pendingCallbacks: PendingTransition[] = [];
  private flushScheduled = false;
  private isTransitioning = false;

  /**
   * Request a DOM-mutating callback to run inside a view transition.
   * All requests made within the same microtask are batched into one
   * `document.startViewTransition()` call.
   *
   * @returns A promise that resolves when the transition animation finishes.
   */
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

    const executeAll = () => {
      for (const item of batch) {
        item.callback();
      }
    };

    const resolveAll = () => {
      this.isTransitioning = false;
      for (const item of batch) {
        item.resolve();
      }
      // Process any requests that arrived while the transition was running
      if (this.pendingCallbacks.length > 0) {
        this.scheduleFlush();
      }
    };

    if (!document.startViewTransition) {
      executeAll();
      resolveAll();
    } else {
      document.startViewTransition(() => executeAll()).finished.then(() => resolveAll());
    }
  }
}

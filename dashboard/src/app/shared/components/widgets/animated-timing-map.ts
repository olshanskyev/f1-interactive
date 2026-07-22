import { computed, effect, inject, signal, Signal } from '@angular/core';
import { areMapKeySequencesEqual, calculateSequenceChanges } from '@core/lib/arrays-maps';
import { ViewTransitionService } from '@core/services/view-transition.service';
import { TimingDataLinesItem } from '@core/types/f1types';

export type Movement = 'up' | 'down' | null;

export interface AnimatedTimingMap {
  /** Drivers ordered by position, updated through the FLIP transition. */
  timingDataMap: Signal<Map<string, TimingDataLinesItem>>;
  /** Per-driver movement direction for the current transition. */
  movements: Signal<Record<string, Movement>>;
  /** Cheap snapshot of `movements` for template lookups. */
  movementsSnapshot: Signal<Record<string, Movement>>;
  /** Stable `[id, timingData]` entries for template iteration. */
  entriesArray: Signal<[string, TimingDataLinesItem][]>;
}

/**
 * Shared position-change animation used by widgets that render a sorted driver
 * list (leaderboard, select-driver). It reacts to an already-sorted timing map
 * (see `LiveService.getSortedTimingDataSignal`) and drives the FLIP transition,
 * exposing the state the templates need.
 *
 * Must be called from an injection context (e.g. a component constructor).
 */
export function createAnimatedTimingMap(
  sortedTiming: Signal<Map<string, TimingDataLinesItem>>
): AnimatedTimingMap {
  const viewTransitionService = inject(ViewTransitionService);

  const timingDataMap = signal<Map<string, TimingDataLinesItem>>(new Map());
  const movements = signal<Record<string, Movement>>({});
  let transitionVersion = 0;

  effect(() => {
    const newTimingDataMap = sortedTiming();
    if (areMapKeySequencesEqual(timingDataMap(), newTimingDataMap)) return; // avoid unnecessary transitions

    const version = ++transitionVersion;
    movements.set(calculateSequenceChanges(timingDataMap(), newTimingDataMap));
    viewTransitionService
      .requestTransition(() => timingDataMap.set(newTimingDataMap))
      .then(() => {
        setTimeout(() => {
          // Only clear movements if no newer transition has been requested
          if (transitionVersion === version) {
            movements.set({});
          }
        }, 2000);
      });
  });

  return {
    timingDataMap: timingDataMap.asReadonly(),
    movements: movements.asReadonly(),
    movementsSnapshot: computed(() => movements()),
    entriesArray: computed(() => Array.from(timingDataMap().entries()))
  };
}

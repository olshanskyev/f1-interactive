import { computed, Signal } from '@angular/core';
import { SessionData, SessionInfo } from '@core/types/f1types';

export function qualifyingPart(sessionData: Signal<SessionData | undefined>)
  : Signal<number | undefined> {
    return computed(() => {
      //get last sessionData.series
      if (!sessionData()?.Series) return undefined;
      const lastSeries = Object.values(sessionData()!.Series).reverse()[0];
      return lastSeries?.QualifyingPart;
    });
}

export function sessionYear(sessionInfo: Signal<SessionInfo | undefined>): Signal<number> {
    return computed(() =>
        sessionInfo()?.StartDate
        ? new Date(sessionInfo()!.StartDate).getFullYear()
        : new Date().getFullYear()
        );
}
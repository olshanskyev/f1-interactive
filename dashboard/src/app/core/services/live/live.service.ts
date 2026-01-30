import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { SseClient } from 'ngx-sse-client';
import { AvailableSignalsType, StateHandler } from './state/state-handler';

export interface UpdateEventRecord {
  className: string;
  updateEvent: any;
  utc: string;
}

@Injectable({
  providedIn: 'root',
})
export class LiveService {
  protected readonly sseClient = inject(SseClient);
  protected readonly http = inject(HttpClient);
  protected readonly stateHandler = new StateHandler();

  live(
        onInit: ((event: any) => void) | undefined,
        onUpdate: ((event: UpdateEventRecord) => void) | undefined,
  ) {
    return this.sseClient.stream('/live').pipe(tap((event) => {
      const messageEvent = (event as MessageEvent<any>);
      if (messageEvent.data) {
        const data = JSON.parse(messageEvent.data);
        if (event.type === 'init') {
            this.stateHandler.init(data);
            if (onInit)
              onInit(data);
        }

        if (event.type === 'update') {
            this.stateHandler.updateState(data);
            if (onUpdate)
              onUpdate(data);
        }
      }

    }
    ));
  }

  get fullStateSignal() {
    return this.stateHandler.fullStateSignal;
  }

  getDriverListSignal() {
    return this.stateHandler.updateSignals['DriverList'].asReadonly();
  }

  getTimingDataSignal() {
    return this.stateHandler.updateSignals['TimingData'].asReadonly();
  }

  getTimingAppDataSignal() {
    return this.stateHandler.updateSignals['TimingAppData'].asReadonly();
  }

   getTimingStatsSignal() {
    return this.stateHandler.updateSignals['TimingStats'].asReadonly();
  }


}
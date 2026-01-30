import { Injectable, WritableSignal } from '@angular/core';
import { tap } from 'rxjs';

import { LiveService, UpdateEventRecord } from './live.service';

export type SimulatorState = 'NOT_INITIALIZED'|'INITIALIZED'|'STARTED'|'STOPPED'|'PAUSED';

export interface SimulatorStateResponse {
  state: SimulatorState,
  numberOfEvents?: number,
  fileName?: string,
  playbackSpeedRatio?: number
}

export interface UpdateStateResponse {
  state: SimulatorState
}

export interface SetRatioResponse {
  playbackSpeedRatio: number,
  state: SimulatorState
}

@Injectable({
  providedIn: 'root',
})
export class SimulatorService extends LiveService {

  init(file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.post<SimulatorStateResponse>('/simulator/init', formData);
  }

  start() {
    return this.http.post<UpdateStateResponse>('/simulator/start',{});
  }

  pause() {
    return this.http.post<UpdateStateResponse>('/simulator/pause',{});
  }

  stop() {
    return this.http.post<UpdateStateResponse>('/simulator/stop',{}).pipe(tap(() => this.stateHandler.clearState()));
  }

  setRatio(request: {playbackSpeedRatio: number}) {
    return this.http.post<SetRatioResponse>('/simulator/playbackSpeedRatio', request);
  }

  state() {
    return this.http.get<SimulatorStateResponse>('/simulator/state');
  }

  rewind(request: {position: number}) {
    return this.http.post<SimulatorStateResponse>('/simulator/rewind', request);
  }

  live(
        onInit: ((event: any) => void) | undefined,
        onUpdate: ((event: UpdateEventRecord) => void) | undefined,
  ) {
    return this.sseClient.stream('/simulator/live').pipe(tap((event) => {
      const messageEvent = (event as MessageEvent<any>);
      if (messageEvent.data) {
        const data = JSON.parse(messageEvent.data);
        if (event.type === 'init') {
          this.stateHandler.init(data.event);
          if (onInit)
            onInit(data.event);
        }

        if (event.type === 'update') {
            this.stateHandler.updateState(data.event);
            if (onUpdate)
              onUpdate(data.event);
        }
      }
    }));
  }

  simulatorControlStream(
      onEndOfEvents: (() => void) | undefined,
      eventNumber: (WritableSignal<number | undefined>) | undefined) {

    return this.sseClient.stream('/simulator/live').pipe(tap((event) => {
      const messageEvent = (event as MessageEvent<any>);
      if (messageEvent.data) {
        const data = JSON.parse(messageEvent.data);
        if (event.type === 'endOfEvents' && onEndOfEvents)
          onEndOfEvents();

        if (data.eventNumber != null && eventNumber)
          eventNumber.set(+data.eventNumber);
      }
    }));
  }

}
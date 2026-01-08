import { Injectable, WritableSignal } from "@angular/core";
import { tap } from "rxjs";

import { LiveService, UpdateEventRecord } from "../live/live.service";

export type SimulatorState = 'NOT_INITIALIZED'|'INITIALIZED'|'STARTED'|'STOPPED'|'PAUSED';

export type SimulatorStateResponse = {
  state: SimulatorState,
  numberOfEvents?: number,
  fileName?: string,
  playbackSpeedRatio?: number
}

export type UpdateStateResponse = {
  state: SimulatorState
}

export type SetRatioResponse = {
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
    return this.http.post<SimulatorStateResponse>('/simulator/init', formData)
  }

  start() {
    return this.http.post<UpdateStateResponse>('/simulator/start',{})
  }

  pause() {
    return this.http.post<UpdateStateResponse>('/simulator/pause',{})
  }

  stop() {
    return this.http.post<UpdateStateResponse>('/simulator/stop',{})
  }

  setRatio(request: {playbackSpeedRatio: number}) {
    return this.http.post<SetRatioResponse>('/simulator/playbackSpeedRatio', request)
  }

  state() {
    return this.http.get<SimulatorStateResponse>('/simulator/state');
  }

  live(
        onInit: ((event: any) => void) | undefined,
        onUpdate: ((event: UpdateEventRecord) => void) | undefined,
  ) {
    return this.simulatorLive(onInit, onUpdate, undefined, undefined);
  }

  /**
   * 
   * @param event className,{json},utc_string
   * @returns 
   */
  private mapUpdateEvent(event: string): UpdateEventRecord {
    const firstCommaPos = event.indexOf(',');
    const lastCommaPos = event.lastIndexOf(',');
    return {
      className: event.substring(0, firstCommaPos),
      updateEvent: JSON.parse(event.substring(firstCommaPos + 1, lastCommaPos)),
      utc: event.substring(lastCommaPos + 1)
    }

  }

  simulatorLive(onInit: ((event: any) => void) | undefined,
      onUpdate: ((event: UpdateEventRecord) => void) | undefined,
      onEndOfEvents: (() => void) | undefined,
      eventNumber: (WritableSignal<number | undefined>) | undefined) {
    
    return this.sseClient.stream('/simulator/live').pipe(tap((event) => {
      const messageEvent = (event as MessageEvent<any>);
      if (messageEvent.data) {
        const data = JSON.parse(messageEvent.data);
        if (event.type === 'init' && onInit)
          onInit(data);
          
        if (event.type === 'update') {
          if (onUpdate)
            onUpdate(this.mapUpdateEvent(data.event));
          if (eventNumber)
            eventNumber.set(+data.eventNumber);
        }

        if (event.type === 'endOfEvents' && onEndOfEvents)
          onEndOfEvents();
      }
    }
    ));
  }
  
}
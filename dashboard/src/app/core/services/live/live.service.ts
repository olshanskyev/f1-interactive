import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { Observable, fromEvent, merge, of, retry, switchMap, tap, timeout, filter } from 'rxjs';
import { SseClient } from 'ngx-sse-client';
import { StateHandler } from './state/state-handler';
import { inflate } from '@core/lib/inflate';
import { Position, PositionCar } from '@core/types/f1types';
import { StackContainer } from '@core/lib/StackContainer';

export interface UpdateEventRecord {
  className: string;
  updateEvent: any;
  utc: string;
}

const HEARTBEAT_TIMEOUT_MS = 15000;
const LAST_MESSAGE_TIMEOUT_MS = HEARTBEAT_TIMEOUT_MS + 5000;
const CONNECTION_TIMEOUT_MS = 2 * HEARTBEAT_TIMEOUT_MS + 5000;

@Injectable()
export abstract class LiveService {

  protected readonly sseClient = inject(SseClient);
  protected readonly http = inject(HttpClient);
  protected readonly stateHandler = new StateHandler();

  protected createKeepAliveStream(url: string): Observable<Event> {
    let lastMessageTime = Date.now();
    const wake$ = merge(
      fromEvent(window, 'pageshow'), // for mobile browsers that suspend background tabs and don't trigger 'online' event when connection is back
      fromEvent(window, 'online'),
      fromEvent(document, 'visibilitychange').pipe(
        filter(() => Date.now() - lastMessageTime > LAST_MESSAGE_TIMEOUT_MS)
      )
    ).pipe(
      filter(() => document.visibilityState === 'visible')
    );

    return merge(of(null), wake$).pipe(
      switchMap(() => this.sseClient.stream(url).pipe(
        timeout(CONNECTION_TIMEOUT_MS),
        retry({ delay: 3000 }),
        tap((event) => {
          if (event instanceof MessageEvent) {
             lastMessageTime = Date.now();
          }
        })
      ))
    );
  }

  abstract live (
        onInit: ((event: any) => void) | undefined,
        onUpdate: ((event: UpdateEventRecord) => void) | undefined
  ): Observable<any>;

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

  getWeatherDataSignal() {
    return this.stateHandler.updateSignals['WeatherData'].asReadonly();
  }

  getSessionInfoSignal() {
    return this.stateHandler.updateSignals['SessionInfo'].asReadonly();
  }

  getSessionDataSignal() {
    return this.stateHandler.updateSignals['SessionData'].asReadonly();
  }

  getRaceControlMessagesSignal() {
    return this.stateHandler.updateSignals['RaceControlMessages'].asReadonly();
  }

  getTrackStatusSignal() {
    return this.stateHandler.updateSignals['TrackStatus'].asReadonly();
  }

  getCarDataZSignal() {
    return this.stateHandler.updateSignals['CarData.z'].asReadonly();
  }

  positions = computed(() => {
        const posZ = this.stateHandler.updateSignals['Position.z']();
        return (posZ)? inflate<Position>(posZ).Position: [];
  });

  posStackContainer = new StackContainer<PositionCar>(this.positions);

  getPositionsLiveSignal(frequency?: 'max' | 'normal') {
    if (frequency === 'max') {
      return this.posStackContainer.liveValue();
    } else
    return computed(() => {
        const posZ = this.stateHandler.updateSignals['Position.z']();
        const array = (posZ)? inflate<Position>(posZ).Position: [];
        // return last value from array
        return array.length > 0 ? array[array.length - 1].Entries : undefined;
    });
  }

  isPositionZAvailable() {
    return this.stateHandler.updateSignals['Position.z']() !== undefined;
  }

  getTeamRadioSignal() {
    return this.stateHandler.updateSignals['TeamRadio'].asReadonly();
  }

  getExtrapolatedClockSignal() {
    return this.stateHandler.updateSignals['ExtrapolatedClock'].asReadonly();
  }

  getSessionStatusSignal() {
    return this.stateHandler.updateSignals['SessionStatus'].asReadonly();
  }
}
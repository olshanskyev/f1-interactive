import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, Signal, WritableSignal } from '@angular/core';
import { Observable, fromEvent, merge, of, retry, switchMap, tap, timeout, filter, finalize, debounceTime } from 'rxjs';
import { SseClient } from 'ngx-sse-client';
import { StateHandler } from './state/state-handler';
import { inflate } from '@core/lib/inflate';
import { PositionZ, CarPosition, CarDataZ, CarData, TimingDataLinesItem } from '@core/types/f1types';
import { BundleContainer } from '@core/lib/bundle-container';
import { DelayedQueue } from '@core/lib/delayed_queue';
import { isMobile } from '@core/lib/device';
import { sortTimingDataByPosition } from '@core/lib/sorting';

export interface UpdateEventRecord {
  className: string;
  updateEvent: any;
  utc: number;
}

const HEARTBEAT_TIMEOUT_MS = 15000;
const LAST_MESSAGE_TIMEOUT_MS = HEARTBEAT_TIMEOUT_MS + 5000;
const CONNECTION_TIMEOUT_MS = 2 * HEARTBEAT_TIMEOUT_MS + 5000;

@Injectable()
export abstract class LiveService {

  protected readonly sseClient = inject(SseClient);
  protected readonly http = inject(HttpClient);
  protected readonly stateHandler = new StateHandler();
  protected delayedQueue = new DelayedQueue((data) => this.stateHandler.updateState(data));

  /**
   *
   * @param url
   * @param liveConnection A signal containing the current connection timestamp or undefined.
   * @returns
   */
  protected createKeepAliveStream(
      url: string,
      liveConnection: WritableSignal<{time: number} | undefined> | undefined = undefined)
    : Observable<Event> {
    let lastMessageTime = Date.now();
    const wake$ = merge(
      fromEvent(window, 'pageshow'), // for mobile browsers that suspend background tabs and don't trigger 'online' event when connection is back
      fromEvent(window, 'online'),
      fromEvent(document, 'visibilitychange')
    ).pipe(
      filter(() => document.visibilityState === 'visible'),
      filter(() => {
        const isTimeoutExceeded = Date.now() - lastMessageTime > LAST_MESSAGE_TIMEOUT_MS;
        return isMobile || isTimeoutExceeded;
      }),
      debounceTime(100),
    );

    return merge(of(null), wake$).pipe(
      switchMap(() => {
        this.clearQueue();
        let isFirstMessage = true;
        return this.sseClient.stream(url).pipe(
          timeout(CONNECTION_TIMEOUT_MS),
          retry({ delay: 3000 }),
          tap((event) => {
            const eventType = event?.type;
            // filter possible system messages that are not updates, but still indicate a live connection
            if (eventType === 'update' ||
                eventType === 'heartbeat' ||
                eventType === 'init') {
              lastMessageTime = Date.now();
              if (isFirstMessage) {
                isFirstMessage = false;
                if (liveConnection) liveConnection.set({ time: lastMessageTime });
              }
            }
          }),
          finalize(() => {
            if (liveConnection)
              liveConnection.set(undefined);
          })
        );
      })
    );
  }

  abstract live (
        onInit: ((event: any) => void) | undefined,
        onUpdate: ((event: UpdateEventRecord) => void) | undefined
  ): Observable<any>;

  public abstract getLiveConnectionSignal(): Signal<{time: number} | undefined>;

  /**
   * Updates the delay in the queue.
   * @internal Should only be called by `SyncService`.
   */
  setDelay(delayMs: number) {
    this.delayedQueue.setDelay(delayMs);
  }

  protected updateStateWithDelay(data: UpdateEventRecord) {
    this.delayedQueue.add(data);
  }

  protected clearQueue() {
    this.delayedQueue.clear();
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

  // Position.z
  private positions = computed(() => {
        const posZ = this.stateHandler.updateSignals['Position.z']();
        return (posZ)? inflate<PositionZ>(posZ).Position: [];
  });

  private posBundleContainer = new BundleContainer<CarPosition>(this.positions);

  private normalPositionSignal = computed(() => {
      const posZ = this.stateHandler.updateSignals['Position.z']();
      const array = (posZ)? inflate<PositionZ>(posZ).Position: [];
      // return last value from array
      return array.length > 0 ? array[array.length - 1].Entries : undefined;
  });

  getPositionsLiveSignal(frequency?: 'max' | 'normal') {
    if (frequency === 'max') {
      return this.posBundleContainer.liveValue();
    } else
    return this.normalPositionSignal;
  }

  isPositionZAvailable() {
    return this.stateHandler.updateSignals['Position.z']() !== undefined;
  }

  // CarData.Z
  private carData = computed(() => {
    const carZ = this.stateHandler.updateSignals['CarData.z']();
    const array = (carZ)? inflate<CarDataZ>(carZ).Entries: [];
    // map to Bundle type {Timestamp, Entries}
    return array.map(item => ({Timestamp: item.Utc, Entries: item.Cars}));
  });

  private carDataBundleContainer = new BundleContainer<CarData>(this.carData);

  private normalCarDataSignal = computed(() => {
      const carZ = this.stateHandler.updateSignals['CarData.z']();
      const array = (carZ)? inflate<CarDataZ>(carZ).Entries: [];
      // return last value from array
      return array.length > 0 ? array[array.length - 1].Cars : undefined;
  });

  getCarDataLiveSignal(frequency?: 'max' | 'normal') {
    if (frequency === 'max') {
      return this.carDataBundleContainer.liveValue();
    } else
    return this.normalCarDataSignal;
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

  getLapCountSignal() {
    return this.stateHandler.updateSignals['LapCount'].asReadonly();
  }

  private qualifyingPartSignal = computed(() => {
    const sessionData = this.getSessionDataSignal();
    //get last sessionData.series
      if (!sessionData()?.Series) return undefined;
      const lastSeries = Object.values(sessionData()!.Series).reverse()[0];
      return lastSeries?.QualifyingPart;
  });

  getQualifyingPartSignal() {
    return this.qualifyingPartSignal;
  }

  private sessionYearSignal = computed(() => {
    const sessionInfo = this.getSessionInfoSignal();
    return sessionInfo()?.StartDate
        ? new Date(sessionInfo()!.StartDate).getFullYear()
        : new Date().getFullYear();
  });

  getSessionYearSignal() {
    return this.sessionYearSignal;
  }

  private sessionFinishedSignal = computed(() => {
    const sessionStatus = this.getSessionStatusSignal();
    return sessionStatus()?.Status === 'Finished' ||
           sessionStatus()?.Status === 'Finalised' ||
           sessionStatus()?.Status === 'Ends';
  });


  getSessionFinishedSignal() {
    return this.sessionFinishedSignal;
  }

  private sessionEndedSignal = computed(() => {
    const sessionStatus = this.getSessionStatusSignal();
    return (sessionStatus())? (sessionStatus()!.Status === 'Ends') : undefined;
  });

  public getSessionEndedSignal() {
    return this.sessionEndedSignal;
  }

  private isRaceSignal = computed(() => {
    const sessionInfo = this.getSessionInfoSignal();
    return sessionInfo()?.Type === 'Race';
  });

  getIsRaceSignal() {
    return this.isRaceSignal;
  }

  private sessionIsOngoingSignal = computed(() => {
    const sessionInfo = this.getSessionInfoSignal();
    return sessionInfo()?.SessionStatus === 'Started';
  });

  getSessionIsOngoingSignal() {
    return this.sessionIsOngoingSignal;
  }

  private sortedTimingDataSignal = computed(() => {
    const lines = this.getTimingDataSignal()()?.Lines;
    if (!lines) {
      return new Map<string, TimingDataLinesItem>();
    }

    return sortTimingDataByPosition(lines);
  });

  getSortedTimingDataSignal() {
    return this.sortedTimingDataSignal;
  }
}
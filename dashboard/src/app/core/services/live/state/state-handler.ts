import { signal, WritableSignal } from '@angular/core';
import { DriverList, ExtrapolatedClock, LapCount, RaceControlMessages, Root, SessionData, SessionInfo, SessionStatus, TeamRadio, TimingAppData, TimingData, TimingStats, TrackStatus, WeatherData } from '@core/types/f1types';
import { UpdateEventRecord } from '../live.service';

interface SignalTypeMap {
    WeatherData: WeatherData;
    TimingData: TimingData;
    TimingAppData: TimingAppData;
    TimingStats: TimingStats;
    DriverList: DriverList;
    SessionInfo: SessionInfo;
    SessionData: SessionData;
    TrackStatus: TrackStatus;
    'CarData.z': string;
    'Position.z': string;
    RaceControlMessages: RaceControlMessages;
    TeamRadio: TeamRadio;
    ExtrapolatedClock: ExtrapolatedClock;
    SessionStatus: SessionStatus;
    LapCount: LapCount;
}

export type AvailableSignalsType = keyof SignalTypeMap;

export class StateHandler {
    private _state = signal<Root | undefined>(undefined);
    readonly updateSignals: {
            [K in keyof SignalTypeMap]: WritableSignal<
                    SignalTypeMap[K] | undefined
                >
        } = {
            'WeatherData': signal<WeatherData | undefined>(undefined),
            'TimingData': signal<TimingData | undefined>(undefined),
            'TimingAppData': signal<TimingAppData | undefined>(undefined),
            'TimingStats': signal<TimingStats | undefined>(undefined),
            'DriverList': signal<DriverList | undefined>(undefined),
            'SessionInfo': signal<SessionInfo | undefined>(undefined),
            'SessionData': signal<SessionData | undefined>(undefined),
            'TrackStatus': signal<TrackStatus | undefined>(undefined),
            'CarData.z': signal<string | undefined>(undefined),
            'Position.z': signal<string | undefined>(undefined),
            'RaceControlMessages': signal<RaceControlMessages | undefined>(undefined),
            'TeamRadio': signal<TeamRadio | undefined>(undefined),
            'ExtrapolatedClock': signal<ExtrapolatedClock | undefined>(undefined),
            'SessionStatus': signal<SessionStatus | undefined>(undefined),
            'LapCount': signal<LapCount | undefined>(undefined),
    };

    get fullStateSignal() {
        return this._state.asReadonly();
    };

    private updateSignal<K extends keyof SignalTypeMap>
        (key: K, value: SignalTypeMap[K] | undefined) {
            this.updateSignals[key].set(value);
    }

    init(initState: Root) {
        this._state.set(initState);
       (Object.keys(this.updateSignals) as AvailableSignalsType[]).forEach(key => {
            this.updateSignal(key, this._state()![key]);
        });
    }

    updateState(updateRecord: UpdateEventRecord) {
        if (this._state()) {
            const mergedState = {...this._state()!} as Root;
            const key = updateRecord.className as keyof Root;
            mergedState[key] = (key in mergedState)
                ? this.merge(mergedState[key], updateRecord.updateEvent) // key found in state, merge
                : updateRecord.updateEvent; // key not found just copy
            this._state.set(mergedState);

            if (this.updateSignals[key as AvailableSignalsType]) { // send update signal
                const value = mergedState[key as AvailableSignalsType];
                if (typeof value === 'string') {
                    this.updateSignal(
                        key as AvailableSignalsType,
                        value);
                } else {
                    this.updateSignal(
                        key as AvailableSignalsType,
                        {...value!}
                    );
                }


            }
        }
    }

    clearState() {
        this._state.set(undefined);
    }

    private isObject(obj: any): boolean {
	    return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
    };

    private merge(to: any, from: any): any {
        if (from == null) return to;

        if (this.isObject(from)) {
            for (const [key, value] of Object.entries(from)) {
                to[key] = (to[key] == null)? value: this.merge(to[key], value);
            }
            return to;
        } else {
            return from;
        }
    }
}
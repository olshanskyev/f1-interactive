import { signal, WritableSignal } from "@angular/core";
import { DriverList, Root, TimingAppData, TimingData, TimingStats, WeatherData } from "@core/types/f1types";
import { UpdateEventRecord } from "../live.service";

interface SignalTypeMap {
    WeatherData: WeatherData;
    TimingData: TimingData;
    TimingAppData: TimingAppData;
    TimingStats: TimingStats;
    DriverList: DriverList;
}

export type AvailableSignalsType = keyof SignalTypeMap;

export class StateHandler {
    private _state = signal<Root | undefined>(undefined);
    readonly updateSignals: {
            [K in keyof SignalTypeMap]: WritableSignal<SignalTypeMap[K] | undefined>
        } = {
            WeatherData: signal<WeatherData | undefined>(undefined),
            TimingData: signal<TimingData | undefined>(undefined),
            TimingAppData: signal<TimingAppData | undefined>(undefined),
            TimingStats: signal<TimingStats | undefined>(undefined),
            DriverList: signal<DriverList | undefined>(undefined)
    };

    get fullStateSignal() {
        return this._state.asReadonly();
    };

    private updateSignal<K extends keyof SignalTypeMap>(key: K, value: SignalTypeMap[K] | undefined) {
        this.updateSignals[key].set(value);
    }

    init(initState: Root) {
        this._state.set(initState);
       (Object.keys(this.updateSignals) as Array<AvailableSignalsType>).forEach(key => {
            this.updateSignal(key, this._state()![key]);
        });
    }

    updateState(updateRecord: UpdateEventRecord) {
        if (this._state()) {
            let mergedState = {...this._state()!} as Root;
            const key = updateRecord.className as keyof Root;
            mergedState[key] = (key in mergedState)
                ? this.merge(mergedState[key], updateRecord.updateEvent) // key found in state, merge
                : updateRecord.updateEvent; // key not found just copy

            this._state.set(mergedState);

            if (this.updateSignals[key as AvailableSignalsType]) { // send update signal
                this.updateSignal(key as AvailableSignalsType, {...mergedState[key as AvailableSignalsType]!})
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
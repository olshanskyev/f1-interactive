import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { DriverList, Root, TimingAppData, TimingData, TimingStats, WeatherData } from '@core/types/f1types';
import { map } from 'rxjs/internal/operators/map';
import { LiveService, UpdateEventRecord } from './live.service';
import { Observable, of } from 'rxjs';

/**
 * used to provide test data if no live connection is available,
 * or for development without a live connection
 */
@Injectable({
    providedIn: 'root',
})
export class MockLiveService extends LiveService {

    live(
        onInit: ((event: any) => void) | undefined,
        onUpdate: ((event: UpdateEventRecord) => void) | undefined): Observable<any> {
        return of({});
    }

    http = inject(HttpClient);

    constructor() {
        super();
        this.http.get<Root>('data/preview_data/leaderboard.json').pipe(map(res => {
            this.driverList.set(res.DriverList);
            this.timingData.set(res.TimingData);
            this.timingAppData.set(res.TimingAppData);
            this.timingStats.set(res.TimingStats);
            this.sessionData.set(res.SessionData);
         })).subscribe();
    };

    driverList = signal<DriverList | undefined>(undefined);
    timingData = signal<TimingData | undefined>(undefined);
    timingAppData = signal<TimingAppData | undefined>(undefined);
    timingStats = signal<TimingStats | undefined>(undefined);
    sessionData = signal<any | undefined>(undefined);

    clock = signal<any | undefined>(JSON.parse(`{
        "Utc": "2024-11-03T14:00:00Z",
        "Remaining": "00:15:30",
        "Extrapolating": true
    }`));
    sessionInfo = signal<any | undefined>(JSON.parse(`{
        "Meeting": {
            "Name": "Abu Dhabi Grand Prix",
            "Country": {
                "Code": "UAE",
                "Name": "United Arab Emirates"
            },
            "Circuit": {
                "ShortName": "Yas Marina Circuit"
            }
        },
        "Name": "Qualifying"
    }`));

    trackStatus = signal<any | undefined>(JSON.parse(`{
		"Message": "AllClear"
	}`));
    sessionStatus = signal<any | undefined>(JSON.parse(`{
        "Status": "Started"
    }`));

    weatherData = signal<WeatherData>({
        AirTemp: '22',
        TrackTemp: '20',
        Rainfall: '0',
        Humidity: '60',
        Pressure: '1013',
        WindSpeed: '5',
        WindDirection: '91'
    });

    getWeatherDataSignal() {
        return this.weatherData;
    }

    getExtrapolatedClockSignal() {
        return this.clock.asReadonly();
    }
    getSessionInfoSignal() {
        return this.sessionInfo.asReadonly();
    }
    getTrackStatusSignal() {
        return this.trackStatus.asReadonly();
    }
    getSessionStatusSignal() {
        return this.sessionStatus.asReadonly();
    }

    getDriverListSignal() {
        return this.driverList.asReadonly();
    }

    getTimingDataSignal() {
        return this.timingData.asReadonly();
    }

    getTimingAppDataSignal() {
        return this.timingAppData.asReadonly();
    }

    getTimingStatsSignal() {
        return this.timingStats.asReadonly();
    }

    getSessionDataSignal() {
        return this.sessionData.asReadonly();
    }


}
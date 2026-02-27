import { Component, inject, Injectable, signal } from '@angular/core';
import { ContaineredWidget } from '../../containered-widget';
import { MatIconModule } from '@angular/material/icon';
import { LiveService } from '@core/services/live/live.service';
import { Leaderboard } from '../leaderboard';
import { HttpClient } from '@angular/common/http';
import { DriverList, Root, TimingAppData, TimingData, TimingStats } from '@core/types/f1types';
import { map } from 'rxjs/internal/operators/map';

@Injectable()
class MockLiveService {
    http = inject(HttpClient);
    constructor() {
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

@Component({
    selector: 'leaderboard-widget-preview',
    imports: [
        MatIconModule,
        Leaderboard
    ],
    providers: [
        { provide: LiveService, useClass: MockLiveService }
    ],
    template: `
        <div class="widget-preview-container">
                <leaderboard [settings]="settings()"/>
        </div>
    `
})
export class LeaderboardWidgetPreview extends ContaineredWidget {
}
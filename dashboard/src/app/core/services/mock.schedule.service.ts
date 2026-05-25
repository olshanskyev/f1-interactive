import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Round } from '@core/types/schedule';

@Injectable({
    providedIn: 'root'
})
export class MockScheduleService {
    protected readonly http = inject(HttpClient);

    private fetchSchedule() {
        const url = 'data/preview_data/schedule_2026.json';
        return this.http.get<Round[]>(url);
    }

    private schedule = toSignal(this.fetchSchedule());

    private nextRound = computed(() => {
        return (this.schedule())? this.schedule()![2]: null;
    });

    private nextSession = computed(() => {
        return (this.nextRound())? this.nextRound()!.sessions[1]: null;
    });

    public getNextSession() {
        return this.nextSession;
    }

    public getNextRound() {
        return this.nextRound;
    }

    public getSchedule() {
        return this.schedule;
    }

}
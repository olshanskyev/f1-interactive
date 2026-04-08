import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Round } from '@core/types/schedule';

@Injectable({
    providedIn: 'root'
})
export class ScheduleService {
    protected readonly http = inject(HttpClient);

    private fetchSchedule() {
        const url = '/schedule';
        return this.http.get<Round[]>(url);
    }

    private schedule = toSignal(this.fetchSchedule());

    // signal representing the current time — update to force recomputation
    private now = signal(new Date());

    private nextRound = computed(() =>
        this.schedule()?.find(round => new Date(round.end) > this.now()) ?? null
    );

    private nextSession = computed(() => {
    // find the next session that is not over
        const now = this.now();
        for (const session of this.nextRound()?.sessions ?? []) {
            const end = new Date(session.end);
            if (now < end) {
                return session;
            }
        }

        return null;
    });

    public getNextSession() {
        return this.nextSession;
    }

    // to force recomputation of `nextRound`/`nextSession` (e.g., after time change)
    public refreshNow() {
        this.now.set(new Date());
    }

    public getNextRound() {
        return this.nextRound;
    }

    public getSchedule() {
        return this.schedule;
    }

}
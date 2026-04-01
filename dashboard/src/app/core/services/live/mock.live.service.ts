import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Root } from '@core/types/f1types';
import { map } from 'rxjs/internal/operators/map';
import { LiveService, UpdateEventRecord } from './live.service';
import { Observable, of } from 'rxjs';

/**
 * used to provide test data for development without a live connection
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
        this.http.get<Root>('data/preview_data/init.json').pipe(map(res => {
            this.stateHandler.init(res);
         })).subscribe();
    };

    getLiveConnectionSignal() {
        return signal<{time: number} | undefined>(undefined).asReadonly();
    }
}
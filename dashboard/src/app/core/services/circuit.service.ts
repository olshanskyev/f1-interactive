import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CircuitService {
    protected readonly http = inject(HttpClient);
    public getMap(circuitKey: number) {
        const year = new Date().getFullYear();
        const url = `https://api.multiviewer.app/api/v1/circuits/${circuitKey}/${year}`;
        const secondUrl = `/circuits/${circuitKey}`;
        return this.http.get(url).pipe(catchError(() => this.http.get(secondUrl)));
    }
}
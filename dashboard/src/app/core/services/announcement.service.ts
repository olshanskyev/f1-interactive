import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from '@shared/services/storage.service';
import { catchError, map, Observable, of } from 'rxjs';

export interface Announcement {
  id: string;
  /** ISO date/time; shown from this moment on (optional). */
  from?: string;
  /** ISO date/time; not shown after this moment (optional). */
  until?: string;
  /** Text per locale, e.g. { "en-US": "...", "ru-RU": "..." }. */
  text: Record<string, string>;
}

@Injectable({
  providedIn: 'root',
})
export class AnnouncementService {
  protected readonly http = inject(HttpClient);
  private readonly store = inject(LocalStorageService);
  private readonly key = 'f1-interactive-announcements-seen';

  /** Active announcements the user has not seen yet. */
  getUnseen(): Observable<Announcement[]> {
    return this.http.get<{ announcements?: Announcement[] }>('data/announcements.json').pipe(
      map(res => {
        const seen = this.getSeen();
        const now = Date.now();
        return (res.announcements ?? []).filter(a => a.id && !seen[a.id] && isActive(a, now));
      }),
      catchError(() => of([]))
    );
  }

  markSeen(ids: string[]) {
    const seen = this.getSeen();
    const now = new Date().toISOString();
    ids.forEach(id => (seen[id] = now));
    this.store.set(this.key, seen);
  }

  private getSeen(): Record<string, string> {
    return this.store.get(this.key);
  }
}

function isActive(a: Announcement, now: number) {
  const from = a.from ? Date.parse(a.from) : NaN;
  const until = a.until ? Date.parse(a.until) : NaN;
  return !(from > now) && !(until < now);
}

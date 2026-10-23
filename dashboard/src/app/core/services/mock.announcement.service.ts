import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Announcement, AnnouncementService } from './announcement.service';

@Injectable({
  providedIn: 'root',
})
export class MockAnnouncementService extends AnnouncementService {
  // Ignores dates and seen state so the banner is always visible in standalone mode.
  override getUnseen(): Observable<Announcement[]> {
    return this.http
      .get<{ announcements?: Announcement[] }>('data/preview_data/announcements.json')
      .pipe(
        map(res => res.announcements ?? []),
        catchError(() => of([]))
      );
  }

  override markSeen() {
    // nothing to persist in standalone mode
  }
}

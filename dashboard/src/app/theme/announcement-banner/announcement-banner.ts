import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsService } from '@core/bootstrap/settings.service';
import { Announcement, AnnouncementService } from '@core/services/announcement.service';
import { delay, filter, tap } from 'rxjs';
import { DonateButton } from '@shared/donate-button/donate-button';

const FALLBACK_LOCALE = 'en-US';
const MARK_SEEN_DELAY_MS = 3000;

@Component({
  selector: 'app-announcement-banner',
  imports: [MatButtonModule, MatIconModule, TranslateModule, DonateButton],
  templateUrl: './announcement-banner.html',
  styleUrl: './announcement-banner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnouncementBanner {
  private readonly announcementService = inject(AnnouncementService);
  private readonly locale = inject(SettingsService).getLocaleSignal();

  private readonly announcements = signal<Announcement[]>([]);

  readonly messages = computed(() =>
    this.announcements()
      .map(a => ({ id: a.id, text: a.text[this.locale()] ?? a.text[FALLBACK_LOCALE] }))
      .filter(m => !!m.text)
  );

  constructor() {
    this.announcementService
      .getUnseen()
      .pipe(
        tap(list => this.announcements.set(list)),
        filter(list => list.length > 0),
        delay(MARK_SEEN_DELAY_MS),
        takeUntilDestroyed()
      )
      .subscribe(list => this.announcementService.markSeen(list.map(a => a.id)));
  }

  dismiss(id: string) {
    this.announcementService.markSeen([id]);
    this.announcements.update(list => list.filter(a => a.id !== id));
  }
}

import { DatePipe } from '@angular/common';
import { Component, inject, computed, effect } from '@angular/core';
import { ScheduleService, SettingsService } from '@core';
import { TranslateModule } from '@ngx-translate/core';
import { GpCard } from '@shared';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.html',
  styleUrl: './schedule.scss',
  imports: [
    GpCard,
    DatePipe,
    TranslateModule,
  ],
})
export class ScheduleComponent {
  scheduleService = inject(ScheduleService);
  settingsService = inject(SettingsService);
  nextRound = this.scheduleService.getNextRound();
  nextSession = this.scheduleService.getNextSession();
  schedule = this.scheduleService.getSchedule();

  currentLocale = this.settingsService.getLocaleSignal();

  constructor() {
    effect(() => {
      const headerOffset = 64; // 64px for the sticky header
      if (this.nextRound() && this.schedule()) {
        setTimeout(() => {
          const el = document.getElementById('next-round');
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top < headerOffset || rect.bottom > window.innerHeight) {
              const yOffset = -headerOffset;
              const y = rect.top + window.scrollY + yOffset;
              window.scrollTo({ top: y, behavior: 'smooth' });
            }
          }
        });
      }
    });
  }
}

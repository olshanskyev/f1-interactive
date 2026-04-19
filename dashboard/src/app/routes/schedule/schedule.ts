import { DatePipe } from '@angular/common';
import { Component, inject, computed } from '@angular/core';
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
}

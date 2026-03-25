import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ScheduleService } from '@core';
import { TranslateModule } from '@ngx-translate/core';
import { GpCard } from '@shared';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.html',
  styleUrl: './schedule.scss',
  imports: [
    GpCard,
    DatePipe,
    TranslateModule
  ],
})
export class ScheduleComponent {
  scheduleService = inject(ScheduleService);

  nextRound = this.scheduleService.getNextRound();
  nextSession = this.scheduleService.getNextSession();
  schedule = this.scheduleService.getSchedule();

}

import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { LiveService } from '@core/services/live/live.service';
import { ScheduleService } from '@core/services/schedule.service';
import { TranslateModule } from '@ngx-translate/core';
import { SessionCountdown } from '@shared';

@Component({
  selector: 'next-session-panel',
  templateUrl: './next-session-panel.html',
  imports: [MatIconModule, TranslateModule, SessionCountdown, MatButtonModule, RouterLink],
})
export class NextSessionPanel {
  scheduleService = inject(ScheduleService);
  liveService = inject(LiveService);
  nextSession = this.scheduleService.getNextSession();
  nextRound = this.scheduleService.getNextRound();
  isOnGoing = this.liveService.getSessionIsOngoingSignal();
  sessionInfo = this.liveService.getSessionInfoSignal();

  refreshNextSession() {
    this.scheduleService.refreshNow();
  }
}

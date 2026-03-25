import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { LiveService } from '@core/services/live/live.service';
import { ScheduleService } from '@core/services/schedule-service';
import { TranslateModule } from '@ngx-translate/core';
import { SessionCountdown } from '@shared';

@Component({
  selector: 'next-session-panel',
  template: `
    <div class="next-session-container font-formula">
      <div class="d-flex align-items-center justify-content-between">
        <span class="f-s-12 text-color-second">
          @if(nextRound()?.location) {
            {{ nextRound()?.location }},
          }
          {{ nextRound()?.countryName }}
        </span>
        @if(isOnGoing()) {
          <div class="d-flex align-items-center gap-4 button-5">
              <button matButton class="text-f1-red"
                  [routerLink]="'/dashboard'">
                  <mat-icon>sensors</mat-icon>
                  {{'schedule.live' | translate}}
              </button>
          </div>
        }
      </div>
      <span class="f-s-14">{{ nextSession()?.kind }}</span>
      @if (!isOnGoing()) {
        @if (nextSession()?.start; as start) {
          <session-countdown [target]="start"/>
        }
      }
    </div>
  `,
  styleUrl: './next-session-panel.scss',
  imports: [MatIconModule, TranslateModule, SessionCountdown, MatButtonModule, RouterLink],
})
export class NextSessionPanel {
  scheduleService = inject(ScheduleService);
  liveService = inject(LiveService);
  nextSession = this.scheduleService.getNextSession();
  nextRound = this.scheduleService.getNextRound();
  isOnGoing = this.liveService.getSessionIsOngoingSignal();
}

import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ContaineredWidget } from '../containered-widget';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, DatePipe } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { SettingsService } from '@core';
import { sortUtc } from '@core/lib/sorting';
import { SimpleDriverCard } from '@shared/components/driver-card/simple-driver-card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'team-radio-widget',
  standalone: true,
  imports: [
    MatIconModule,
    MatSlideToggleModule,
    CommonModule, DatePipe,
    TranslateModule,
    SimpleDriverCard
  ],
  templateUrl: './team-radio-widget.html',
  styleUrl: './team-radio-widget.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    // set data-containered attribute when the widget is inside a container
    '[attr.data-containered]': 'container ? "true" : null'
  }
})
export class TeamRadioWidget extends ContaineredWidget {
  settingsService = inject(SettingsService);
  teamRadioSignal = this.liveService.getTeamRadioSignal();
  driverList = this.liveService.getDriverListSignal();
  // If the widget is inside a container (custom layout), we always show messages, otherwise we check the user setting
  showRadio = signal((this.container)? true: this.settingsService.getShowTeamRadio());
  sessionInfo = this.liveService.getSessionInfoSignal();

  audioBasePath = computed (() => 'https://livetiming.formula1.com/static/' + this.sessionInfo()?.Path);
  captures = computed(() => {
    const data = this.teamRadioSignal();
    if (!data?.Captures) return [];

    return Object.entries(data.Captures)
      .map(([id, capture]) => ({
        ...capture,
        id,
        src: this.audioBasePath() + capture.Path,
      }))
      .sort(sortUtc);
  });

  showRadioToggle(value: boolean) {
    this.showRadio.set(value);
    this.settingsService.setOptions({ showTeamRadio: value });
  }

}

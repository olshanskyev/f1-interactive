import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { AuthService, SettingsService } from '@core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'simulator-button',
  template: `

    <mat-checkbox
        [checked]="settings.options.useSimulator"
        (change)="applyUseSimulator($event.checked)"
        >
      {{ 'use_simulator' | translate }}
    </mat-checkbox>
  `,
  imports: [TranslateModule, MatCheckboxModule, FormsModule],
})
export class SimulatorButton {
  private readonly auth = inject(AuthService);
  settings = inject(SettingsService);

  applyUseSimulator(checked: boolean) {
    this.settings.setOptions({ useSimulator: checked });
    window.location.reload();
  }
}

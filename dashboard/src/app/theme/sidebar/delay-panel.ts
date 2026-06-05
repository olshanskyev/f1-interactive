import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SettingsService } from '@core';
import { MAX_DELAY_SEC, SyncService } from '@core/services/live/sync.service';
import { TranslateModule } from '@ngx-translate/core';
import { DebounceTime } from '@shared/directives/debounce-time';

@Component({
  selector: 'delay-panel',
  template: `
    <div class="sidebar-container delay-panel-container font-formula d-flex align-items-center">
        <div class="delay-placeholder d-none">
            <mat-icon>timer_av</mat-icon>
        </div>
        <div class="delay-panel d-flex align-items-center w-full">
            <mat-form-field class="form-field-5" appearance="outline" subscriptSizing="dynamic">
                <mat-label>{{'delay_sec' | translate}}</mat-label>
                <input matInput placeholder=""
                    type="number"
                    inputmode="numeric"
                    [disabled]="isPaused()"
                    min="0"
                    [max]="maxDelaySec"
                    step="1"
                    onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                    pattern="[0-9]*"
                    debounceTime="1000"
                    [debouncedValue]="delay()"
                    (debouncedValueChange)="updateDelay($event)"
                />
            </mat-form-field>
            <div>
                <button matIconButton (click)="(isPaused())? resume() : pause()">
                    <mat-icon>{{(isPaused())? 'play_arrow': 'pause'}}</mat-icon>
                </button>
            </div>
            <div>
                <button matIconButton (click)="clearDelay()" [disabled]="isPaused()">
                    <mat-icon>clear</mat-icon>
                </button>
            </div>
        </div>
    </div>
  `,
  imports: [
    MatInputModule,
    DebounceTime,
    FormsModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule],
})
export class DelayPanel {
    syncService = inject(SyncService);
    settingsService = inject(SettingsService);
    isPaused = signal(false);
    delay = signal(this.settingsService.getDelayMs() / 1000);
    maxDelaySec = MAX_DELAY_SEC;

    updateSettings() {
        this.settingsService.setOptions({ delayMs: this.delay() * 1000 });
    }

    updateDelay($event: any) {
        if (!$event || Number.isNaN(Number($event)) || Number($event) < 0) {
            this.delay.set($event); // workaround to clear the input field when invalid value is entered
            setTimeout(() => this.delay.set(0));
            this.syncService.setDelay(0);
            this.updateSettings();
            return;
        }
        this.delay.set(Math.min(Number($event), this.maxDelaySec));
        this.syncService.setDelay(this.delay() * 1000);
        this.updateSettings();
    }

    pause() {
        this.isPaused.set(true);
        this.syncService.pause();
    }

    resume() {
        this.isPaused.set(false);
        this.syncService.resume();
        this.delay.set(this.syncService.getDelayMs() / 1000);
        this.updateSettings();
    }

    clearDelay() {
        this.delay.set(0);
        this.syncService.setDelay(0);
        this.updateSettings();
    }
}

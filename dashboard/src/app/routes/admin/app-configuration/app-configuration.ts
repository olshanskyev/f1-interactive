import { Component, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ServerConfigurationService, SettingsService } from '@core';
import { HotToastService } from '@ngxpert/hot-toast';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import packageInfo from '../../../../../package.json';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-configuration',
  templateUrl: './app-configuration.html',
  styleUrl: './app-configuration.scss',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    FormsModule,
    TranslateModule,
    MatCheckboxModule
  ],
})
export class AppConfigurationComponent {
  serverConfigurationService = inject(ServerConfigurationService);
  hotToast = inject(HotToastService);
  translate = inject(TranslateService);
  settings = inject(SettingsService);

  token = '';
  version = packageInfo.version;
  backendVersion = toSignal(this.serverConfigurationService.getVersion());

  onSubmitToken() {
    if (this.token) {
      this.serverConfigurationService.setLiveToken(this.token).subscribe(() => {
        this.hotToast.success(this.translate.instant('notifications.live_token_updated'));
      });

      this.token = '';
    }
  }


  applyUseSimulator(checked: boolean) {
    this.settings.setOptions({ useSimulator: checked });
    window.location.reload();
  }
}

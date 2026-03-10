import { Component, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ServerConfigurationService } from '@core';
import { HotToastService } from '@ngxpert/hot-toast';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import packageInfo from '../../../../../package.json';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-configuration',
  templateUrl: './app-configuration.html',
  styleUrl: './app-configuration.scss',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    FormsModule,
    TranslateModule
  ],
})
export class AppConfigurationComponent {
  serverConfigurationService = inject(ServerConfigurationService);
  hotToast = inject(HotToastService);
  translate = inject(TranslateService);
  token = '';
  version = packageInfo.version;
  backendVersion = toSignal(this.serverConfigurationService.getVersion());

  onSubmit() {
    if (this.token) {
      this.serverConfigurationService.setLiveToken(this.token).subscribe(() => {
        this.hotToast.success(this.translate.instant('notifications.live_token_updated'));
      });

      this.token = '';
    }
  }
}

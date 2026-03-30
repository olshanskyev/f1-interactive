import { Component, ViewEncapsulation, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/authentication';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-user-panel',
  template: `
    @if (auth.check()) {
      <div class="matero-user-panel sidebar-container" routerLink="/profile/overview">
        @if (user()?.avatar) {
          <img class="matero-user-panel-avatar" [src]="user()?.avatar" alt="avatar" width="64" />
        }
        <div class="matero-user-panel-info">
          <h4>{{ user()?.name }}</h4>
          <h5>{{ user()?.email }}</h5>
        </div>
      </div>
    }
  `,
  styleUrl: './user-panel.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [RouterLink, MatButtonModule, MatIconModule, MatTooltipModule, TranslateModule],
})
export class UserPanel {
  readonly auth = inject(AuthService);
  user = toSignal(this.auth.user());
}

import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { AuthService } from '@core';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-user',
  template: `
    <button matIconButton [matMenuTriggerFor]="menu">
      <img class="avatar" [src]="user()?.avatar" width="24" alt="avatar" />
    </button>

    <mat-menu #menu="matMenu">
      @if (user()?.name) {
        <button mat-menu-item disabled>
          <span>{{ user()?.name }}</span>
        </button>
        <mat-divider/>
      }
      <button mat-menu-item (click)="logout()">
        <mat-icon>exit_to_app</mat-icon>
        <span>{{ 'logout' | translate }}</span>
      </button>
    </mat-menu>
  `,
  styles: `
    .avatar {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50rem;
    }
  `,
  imports: [MatButtonModule, MatIconModule,
    MatMenuModule, TranslateModule, MatDividerModule],
})
export class UserButton {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  user = toSignal(this.auth.user());

  logout() {
    this.auth.logout().subscribe(() => {
      this.router.navigateByUrl('/dashboard');
    });
  }
}

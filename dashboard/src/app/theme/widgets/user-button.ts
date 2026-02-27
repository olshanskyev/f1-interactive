import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { AuthService } from '@core';
import { SimulatorButton } from './simulator-button';
import { NgxRolesService } from 'ngx-permissions';
import { isAdmin } from '@core/lib/roles';

@Component({
  selector: 'app-user',
  template: `
    <button matIconButton [matMenuTriggerFor]="menu">
      <img class="avatar" [src]="user()?.avatar" width="24" alt="avatar" />
    </button>

    <mat-menu #menu="matMenu">
      <button routerLink="/profile/settings" mat-menu-item>
        <mat-icon>edit</mat-icon>
        <span>{{ 'edit_profile' | translate }}</span>
      </button>
      <button mat-menu-item (click)="logout()">
        <mat-icon>exit_to_app</mat-icon>
        <span>{{ 'logout' | translate }}</span>
      </button>
      @if (isAdmin()) {
        <simulator-button class="p-l-4"/>
      }
    </mat-menu>
  `,
  styles: `
    .avatar {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50rem;
    }
  `,
  imports: [RouterLink, MatButtonModule, MatIconModule,
    MatMenuModule, TranslateModule, SimulatorButton],
})
export class UserButton {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  private readonly roleService = inject(NgxRolesService);
  roles = toSignal(this.roleService.roles$);

  isAdmin = computed(() =>
    isAdmin(this.roles())
  );

  user = toSignal(this.auth.user());

  logout() {
    this.auth.logout().subscribe(() => {
      this.router.navigateByUrl('/dashboard');
    });
  }
}

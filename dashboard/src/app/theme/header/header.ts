import { Component,  ViewEncapsulation, computed, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { Branding } from '../widgets/branding';
import { TranslateButton } from '../widgets/translate-button';
import { UserButton } from '../widgets/user-button';
import { AuthService, FullScreenService } from '@core';
import { Router, RouterLink } from '@angular/router';
import { LayoutsButton } from '@theme/widgets/layouts-button/layouts-button';
import { SimulatorButton } from '@theme/widgets/simulator-button';
import { isAdmin } from '@core/lib/roles';
import { NgxRolesService } from 'ngx-permissions';
import { toSignal } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.scss',
  host: {
    class: 'matero-header',
  },
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    Branding,
    TranslateButton,
    UserButton,
    RouterLink,
    LayoutsButton,
    SimulatorButton
  ],
})
export class Header {
  readonly authService = inject(AuthService);
  readonly router = inject(Router);

  readonly showToggle = input(true);
  readonly showBranding = input(false);
  readonly toggleSidenav = output<void>();

  readonly fullScreenService = inject(FullScreenService);
  private readonly roleService = inject(NgxRolesService);
  roles = toSignal(this.roleService.roles$);

  isAdmin = computed(() =>
    isAdmin(this.roles())
  );

  toggleFullscreen() {
    this.fullScreenService.toggleFullScreen();
  }
}

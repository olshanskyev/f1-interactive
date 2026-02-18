import { Component,  ViewEncapsulation, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { Branding } from '../widgets/branding';
import { TranslateButton } from '../widgets/translate-button';
import { UserButton } from '../widgets/user-button';
import { AuthService, FullScreenService } from '@core';
import { Router, RouterLink } from '@angular/router';
import { LayoutsButton } from '@theme/widgets/layouts-button/layouts-button';


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
    LayoutsButton
  ],
})
export class Header {
  readonly authService = inject(AuthService);
  readonly router = inject(Router);

  readonly showToggle = input(true);
  readonly showBranding = input(false);
  readonly toggleSidenav = output<void>();

  readonly fullScreenService = inject(FullScreenService);

  toggleFullscreen() {
    this.fullScreenService.toggleFullScreen();
  }
}

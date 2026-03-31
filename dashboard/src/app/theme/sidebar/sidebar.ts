import { Component, ViewEncapsulation, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';

import { Sidemenu } from '../sidemenu/sidemenu';
import { Branding } from '../widgets/branding';
import { UserPanel } from './user-panel';
import { NextSessionPanel } from './next-session-panel/next-session-panel';
import { LinksPanel } from './links-panel';
import { MatDividerModule } from '@angular/material/divider';
import { DelayPanel } from './delay-panel';
import { LiveService } from '@core/services/live/live.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatSlideToggleModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    Branding,
    Sidemenu,
    UserPanel,
    NextSessionPanel,
    LinksPanel,
    MatDividerModule,
    DelayPanel
  ],
})
export class Sidebar {
  readonly showToggle = input(true);
  readonly showUser = input(true);
  readonly showHeader = input(true);
  readonly toggleChecked = input(false);

  readonly toggleCollapsed = output<void>();
  readonly closeSidenav = output<void>();
  private readonly liveService = inject(LiveService);
  sessionEnded = this.liveService.getSessionEndedSignal();

}

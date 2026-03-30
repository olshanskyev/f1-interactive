import { BidiModule } from '@angular/cdk/bidi';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnDestroy, ViewEncapsulation, computed, inject, signal, viewChild } from '@angular/core';
import { MatSidenav, MatSidenavContent, MatSidenavModule } from '@angular/material/sidenav';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NgProgressbar } from 'ngx-progressbar';
import { NgProgressRouter } from 'ngx-progressbar/router';
import { Subscription, filter } from 'rxjs';

import { FullScreenService, SettingsService } from '@core';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';

const MOBILE_MEDIAQUERY = 'screen and (max-width: 599px)';
const MONITOR_MEDIAQUERY = 'screen and (min-width: 600px)';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [
    RouterOutlet,
    BidiModule,
    MatSidenavModule,
    NgProgressbar,
    NgProgressRouter,
    Header,
    Sidebar,
  ],
})
export class AdminLayout implements OnDestroy {
  readonly sidenav = viewChild.required<MatSidenav>('sidenav');
  readonly content = viewChild.required<MatSidenavContent>('content');

  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly router = inject(Router);
  private readonly settings = inject(SettingsService);
  private readonly fullScreenService = inject(FullScreenService);

    // Signals for state
  readonly options = signal(this.settings.options);
  readonly isMobileScreen = signal(false);
  readonly isFullScreen = this.fullScreenService.isFullScreen();
  get themeColor() {
    return this.settings.getThemeColor();
  }

  readonly isOver = computed(() => this.isMobileScreen());

  private layoutChangesSub = Subscription.EMPTY;

  constructor() {
    this.layoutChangesSub = this.breakpointObserver
      .observe([MOBILE_MEDIAQUERY, MONITOR_MEDIAQUERY])
      .subscribe(state => {
        if (state.breakpoints[MOBILE_MEDIAQUERY]) {
          this.isMobileScreen.set(true);
          this.options.update(opt => ({ ...opt, sidenavCollapsed: false }));
        } else {
          this.isMobileScreen.set(false);
        }
      });

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(e => {
      if (this.isOver()) {
        this.sidenav().close();
      }
      this.content().scrollTo({ top: 0 });
    });
  }

  ngOnDestroy() {
    this.layoutChangesSub.unsubscribe();
  }

  toggleCollapsed() {
    this.options.update(opt => ({ ...opt, sidenavCollapsed: !opt.sidenavCollapsed }));
    this.settings.setOptions({sidenavCollapsed: this.options().sidenavCollapsed});

  }

  onSidenavOpenedChange(isOpened: boolean) {
    this.options.update(opt => ({ ...opt, sidenavOpened: isOpened }));
    this.settings.setOptions({sidenavOpened: isOpened});
  }

}
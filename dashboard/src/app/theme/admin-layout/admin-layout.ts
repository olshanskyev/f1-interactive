import { BidiModule } from '@angular/cdk/bidi';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnDestroy, ViewEncapsulation, inject, viewChild } from '@angular/core';
import { MatSidenav, MatSidenavContent, MatSidenavModule } from '@angular/material/sidenav';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NgProgressbar } from 'ngx-progressbar';
import { NgProgressRouter } from 'ngx-progressbar/router';
import { signal, computed, effect } from '@angular/core';
import { Subscription, filter } from 'rxjs';

import { AppSettings, SettingsService } from '@core';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { MOBILE_MEDIAQUERY, MONITOR_MEDIAQUERY, TABLET_MEDIAQUERY } from '@theme/media_queries';

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
    Sidebar
  ],
  host: {
    '[class.matero-content-width-fix]': 'contentWidthFix()',
    '[class.matero-sidenav-collapsed-fix]': 'collapsedWidthFix()',
  },
})
export class AdminLayout implements OnDestroy {
  readonly sidenav = viewChild.required<MatSidenav>('sidenav');
  readonly content = viewChild.required<MatSidenavContent>('content');

  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly router = inject(Router);
  private readonly settings = inject(SettingsService);

  // Signals for state
  readonly options = signal(this.settings.options);
  readonly isMobileScreen = signal(false);
  readonly isContentWidthFixed = signal(true);
  readonly isCollapsedWidthFixed = signal(false);

  get themeColor() {
    return this.settings.getThemeColor();
  }

  readonly isOver = computed(() => this.isMobileScreen());

  readonly contentWidthFix = computed(() =>
    this.isContentWidthFixed() &&
    this.options().navPos === 'side' &&
    this.options().sidenavOpened &&
    !this.isOver()
  );

  readonly collapsedWidthFix = computed(() =>
    this.isCollapsedWidthFixed() &&
    (this.options().navPos === 'top' || (this.options().sidenavOpened && this.isOver()))
  );

  private layoutChangesSubscription = Subscription.EMPTY;

  constructor() {
    this.layoutChangesSubscription = this.breakpointObserver
      .observe([MOBILE_MEDIAQUERY, TABLET_MEDIAQUERY, MONITOR_MEDIAQUERY])
      .subscribe(state => {
        // SidenavOpened must be reset true when layout changes
        this.options.update(opt => ({ ...opt, sidenavOpened: true }));

        this.isMobileScreen.set(state.breakpoints[MOBILE_MEDIAQUERY]);
        this.options.update(opt => ({
          ...opt,
          sidenavCollapsed: state.breakpoints[TABLET_MEDIAQUERY],
        }));
        this.isContentWidthFixed.set(state.breakpoints[MONITOR_MEDIAQUERY]);
      });

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(e => {
      if (this.isOver()) {
        this.sidenav().close();
      }
      this.content().scrollTo({ top: 0 });
    });

    effect(() => {
      this.settings.setOptions(this.options());
    });
  }

  ngOnDestroy() {
    this.layoutChangesSubscription.unsubscribe();
  }

  toggleCollapsed() {
    this.isContentWidthFixed.set(false);
    this.options.update(opt => ({ ...opt, sidenavCollapsed: !opt.sidenavCollapsed }));
  }

  onSidenavClosedStart() {
    this.isContentWidthFixed.set(false);
  }

  onSidenavOpenedChange(isOpened: boolean) {
    this.isCollapsedWidthFixed.set(!this.isOver());
    this.options.update(opt => ({ ...opt, sidenavOpened: isOpened }));
    this.settings.setOptions(this.options());
  }

  updateOptions(options: AppSettings) {
    this.options.set(options);
    this.settings.setOptions(options);
    this.settings.setDirection();
    this.settings.setTheme();
  }

}

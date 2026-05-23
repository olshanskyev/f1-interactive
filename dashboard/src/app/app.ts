import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { PreloaderService, SettingsService } from '@core';
import { RouterOutlet } from '@angular/router';
import { environment } from '@env/environment';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet />
  `,
  imports: [RouterOutlet],
})
export class App implements OnInit, AfterViewInit {
  private readonly preloader = inject(PreloaderService);
  private readonly settings = inject(SettingsService);
  private readonly document = inject(DOCUMENT);

  ngOnInit() {
    this.settings.setDirection();
    this.settings.setTheme();

    if (environment.production && environment.umamiWebsiteId && environment.umamiWebsiteId !== '__UMAMI_WEBSITE_ID__') {
      const script = this.document.createElement('script');
      script.defer = true;
      script.src = '/umami/script.js';
      script.setAttribute('data-website-id', environment.umamiWebsiteId);
      this.document.head.appendChild(script);
    }
  }

  ngAfterViewInit() {
    this.preloader.hide();
  }
}

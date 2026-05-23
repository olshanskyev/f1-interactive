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

    const websiteId = environment.umamiWebsiteId;
    // Prevent static evaluation from removing this block during build
    const placeholderPrefix = '__UMA' + 'MI_';
    if (environment.production && websiteId && !websiteId.startsWith(placeholderPrefix)) {
      const script = this.document.createElement('script');
      script.defer = true;
      script.src = 'https://cloud.umami.is/script.js';
      script.setAttribute('data-website-id', websiteId);
      this.document.head.appendChild(script);
    }
  }

  ngAfterViewInit() {
    this.preloader.hide();
  }
}

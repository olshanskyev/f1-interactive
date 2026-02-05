import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';

import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MAT_CARD_CONFIG } from '@angular/material/card';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { provideDateFnsDatetimeAdapter } from '@ng-matero/extensions-date-fns-adapter';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideHotToastConfig } from '@ngxpert/hot-toast';
import { NgxPermissionsModule } from 'ngx-permissions';

import {
  BASE_URL,
  BASE_URL_SIMULATOR,
  interceptors,
  LiveService,
  SettingsService,
  SimulatorService,
  StartupService,
  TranslateLangService,
} from '@core';
import { environment } from '@env/environment';
import { routes } from './app.routes';

import { LoginService } from '@core/authentication/login.service';
import { FullscreenOverlayContainer, OverlayContainer } from '@angular/cdk/overlay';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    { provide: BASE_URL, useValue: environment.baseUrl },
    { provide: BASE_URL_SIMULATOR, useValue: environment.baseUrlSimulator },
    provideAppInitializer(() => inject(TranslateLangService).load()),
    provideAppInitializer(() => inject(StartupService).load()),
    provideHttpClient(withInterceptors(interceptors)),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
      withComponentInputBinding()
    ),
    provideHotToastConfig(),
    provideTranslateService({
      loader: provideTranslateHttpLoader({ prefix: 'i18n/', suffix: '.json' }),
    }),
    importProvidersFrom(
      NgxPermissionsModule.forRoot(),
    ),

    { provide: LoginService, useClass: LoginService },

    //ToDo make conditional
    { provide: LiveService, useClass: SimulatorService },
    // for showing dialogs in fullscreen mode
    { provide: OverlayContainer, useClass: FullscreenOverlayContainer },

    {
      provide: MAT_DATE_LOCALE,
      useFactory: () => inject(SettingsService).getLocale(),
    },
    {
      provide: MAT_CARD_CONFIG,
      useValue: {
        appearance: 'outlined',
      },
    },
    provideDateFnsAdapter({
      parse: {
        dateInput: 'yyyy-MM-dd',
      },
      display: {
        dateInput: 'yyyy-MM-dd',
        monthYearLabel: 'yyyy MMM',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'yyyy MMM',
      },
    }),
    provideDateFnsDatetimeAdapter({
      parse: {
        dateInput: 'yyyy-MM-dd',
        yearInput: 'yyyy',
        monthInput: 'MMMM',
        datetimeInput: 'yyyy-MM-dd HH:mm',
        timeInput: 'HH:mm',
      },
      display: {
        dateInput: 'yyyy-MM-dd',
        yearInput: 'yyyy',
        monthInput: 'MMMM',
        datetimeInput: 'yyyy-MM-dd HH:mm',
        timeInput: 'HH:mm',
        monthYearLabel: 'yyyy MMMM',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM yyyy',
        popupHeaderDateLabel: 'MMM dd, E',
      },
    }),
  ],
};

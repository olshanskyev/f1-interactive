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
import { MAT_CARD_CONFIG } from '@angular/material/card';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideHotToastConfig } from '@ngxpert/hot-toast';
import { NgxPermissionsModule } from 'ngx-permissions';

import {
  BASE_URL,
  BASE_URL_SIMULATOR,
  interceptors,
  F1InteractiveService,
  SettingsService,
  SimulatorService,
  StartupService,
  TranslateLangService,
  MockLiveService,
} from '@core';
import { environment } from '@env/environment';
import { routes } from './app.routes';

import { LoginService } from '@core/authentication/login.service';
import { LiveService } from '@core/services/live/live.service';

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

    {
      provide: LiveService,
      useFactory: () => {
        if (environment.standalone) {
          return inject(MockLiveService);
        }
        const settings: SettingsService = inject(SettingsService);
        return (settings.getUseSimulator())?
          inject(SimulatorService) : inject(F1InteractiveService);
      }
    },
    {
      provide: MAT_CARD_CONFIG,
      useValue: {
        appearance: 'outlined',
      },
    },
  ],
};

import { provideZonelessChangeDetection } from '@angular/core';
import { SettingsService } from '@core';

export default [
    provideZonelessChangeDetection(),
    { provide: SettingsService, useValue: { getLocaleSignal: () => null } }
];
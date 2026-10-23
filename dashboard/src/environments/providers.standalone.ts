import { Provider } from '@angular/core';
import { AnnouncementService } from '@core/services/announcement.service';
import { LiveService } from '@core/services/live/live.service';
import { MockLiveService } from '@core/services/live/mock.live.service';
import { MockAnnouncementService } from '@core/services/mock.announcement.service';
import { MockScheduleService } from '@core/services/mock.schedule.service';
import { ScheduleService } from '@core/services/schedule.service';

export const environmentProviders: Provider[] = [
  { provide: LiveService, useExisting: MockLiveService },
  { provide: ScheduleService, useClass: MockScheduleService },
  { provide: AnnouncementService, useClass: MockAnnouncementService },
];

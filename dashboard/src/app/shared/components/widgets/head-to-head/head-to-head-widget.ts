import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal } from '@angular/core';
import { ContaineredWidget } from '../containered-widget';
import { SpeedoComponent } from '@shared/components/speedo/speedo';
import { CarData } from '@core/types/f1types';
import { SimpleDriverCard } from '@shared/components/driver-card/simple-driver-card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SelectDriverWidget } from '../select-driver/select-driver-widget';
import { TranslateModule } from '@ngx-translate/core';
import { DriverSelectionService } from '@core/services/driver-selection.service';
import { KeyValuePipe, NgTemplateOutlet } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { IntervalPipe } from '@shared/pipes';

export const headToHeadModes = ['telemetry', 'last', 'best'] as const;
export type HeadToHeadMode = (typeof headToHeadModes)[number];

@Component({
  selector: 'head-to-head-widget',
  imports: [
    SpeedoComponent,
    SimpleDriverCard,
    MatButtonModule,
    MatIconModule,
    SelectDriverWidget,
    TranslateModule,
    KeyValuePipe,
    NgTemplateOutlet,
    MatDividerModule,
    IntervalPipe
  ],
  templateUrl: './head-to-head-widget.html',
  styleUrl: './head-to-head-widget.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    // set data-containered attribute when the widget is inside a container
    '[attr.data-containered]': 'container ? "true" : null'
  }
})
export class HeadToHeadWidget extends ContaineredWidget {

    private readonly carData = this.liveService.getCarDataLiveSignal('max');
    private readonly driverList = this.liveService.getDriverListSignal();
    private readonly timingData = this.liveService.getTimingDataSignal();
    private readonly timingStats = this.liveService.getTimingStatsSignal();
    private readonly driverSelectionService = inject(DriverSelectionService);

    private readonly settingsMode = computed(() => this.settings()?.['mode'] ?? 'telemetry');
    mode = linkedSignal<HeadToHeadMode>(() =>this.settingsMode());

    driver1 = this.driverSelectionService.getDriver1();
    driver2 = this.driverSelectionService.getDriver2();

    driverItem1 = computed(() => (this.driver1() ?
      this.driverList()?.Lines?.[this.driver1()!] :
      undefined));
    driverItem2 = computed(() => (this.driver2() ?
      this.driverList()?.Lines?.[this.driver2()!] :
      undefined));

    timingDataDriver1 = computed(() => this.timingData()?.Lines?.[this.driver1() ?? '']);
    timingDataDriver2 = computed(() => this.timingData()?.Lines?.[this.driver2() ?? '']);

    timingStatDriver1 = computed(() => this.timingStats()?.Lines?.[this.driver1() ?? '']);
    timingStatDriver2 = computed(() => this.timingStats()?.Lines?.[this.driver2() ?? '']);

    pos1 = computed(() => this.timingDataDriver1()?.Line ?? 0);
    pos2 = computed(() => this.timingDataDriver2()?.Line ?? 0);

    getChannelValue(driver: string | undefined, channel: keyof CarData['Channels']): number | undefined {
        if (!this.carData() || !driver) return undefined;
        return this.carData()![driver]?.Channels[channel];
    }
    speed1 = computed(() => this.getChannelValue(this.driver1(), 2) ?? 0);
    speed2 = computed(() => this.getChannelValue(this.driver2(), 2) ?? 0);
    rpm1 = computed(() => this.getChannelValue(this.driver1(), 0) ?? 0);
    rpm2 = computed(() => this.getChannelValue(this.driver2(), 0) ?? 0);
    gear1 = computed(() => this.getChannelValue(this.driver1(), 3) ?? 0);
    gear2 = computed(() => this.getChannelValue(this.driver2(), 3) ?? 0);
    throttle1 = computed(() => this.getChannelValue(this.driver1(), 4) ?? 0);
    throttle2 = computed(() => this.getChannelValue(this.driver2(), 4) ?? 0);
    brake1 = computed(() => this.getChannelValue(this.driver1(), 5) ?? 0);
    brake2 = computed(() => this.getChannelValue(this.driver2(), 5) ?? 0);

    deselect(driverId: string) {
      this.driverSelectionService.deselect(driverId);
    }

}
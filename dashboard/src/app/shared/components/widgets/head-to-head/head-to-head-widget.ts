import { ChangeDetectionStrategy, Component, computed, effect, inject, linkedSignal } from '@angular/core';
import { ContaineredWidget } from '../containered-widget';
import { SpeedoComponent } from '@shared/components/speedo/speedo';
import { SelectDriverWidget } from '../select-driver/select-driver-widget';
import { DriverSelectionService } from '@core/services/driver-selection.service';
import { HeadToHeadDriver } from './head-to-head-driver';
import { HeadToHeadTelemetryCard } from './telemetry-card/telemetry-card';
import { HeadToHeadLapComparison } from './lap-comparison/lap-comparison';
import { HeadToHeadTimeAttack } from './time-attack/time-attack';
import { HeadToHeadDriverSkeleton } from './driver-skeleton/driver-skeleton';

export const headToHeadModes = ['telemetry', 'time_attack','last', 'best'] as const;
export type HeadToHeadMode = (typeof headToHeadModes)[number];

@Component({
  selector: 'head-to-head-widget',
  imports: [
    SpeedoComponent,
    SelectDriverWidget,
    HeadToHeadTelemetryCard,
    HeadToHeadLapComparison,
    HeadToHeadTimeAttack,
    HeadToHeadDriverSkeleton
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
    private readonly timingAppData = this.liveService.getTimingAppDataSignal();
    private readonly driverSelectionService = inject(DriverSelectionService);

    private readonly settingsMode = computed(() => this.settings()?.['mode'] ?? 'telemetry');
    mode = linkedSignal<HeadToHeadMode>(() =>this.settingsMode());

    private readonly driver1 = this.driverSelectionService.getDriver1();
    private readonly driver2 = this.driverSelectionService.getDriver2();

    headToHeadDriver1 = computed(() => this.toHeadToHeadDriver(this.driver1()));
    headToHeadDriver2 = computed(() => this.toHeadToHeadDriver(this.driver2()));

    // kept separate from headToHeadDriver so high-frequency telemetry doesn't re-render lap comparison
    channels1 = computed(() => this.getChannels(this.driver1()));
    channels2 = computed(() => this.getChannels(this.driver2()));

    bestLapTime = this.liveService.getBestLapTimeSignal();
    bestDriver = computed(() => this.toHeadToHeadDriver(this.bestLapTime()?.driver));

    private toHeadToHeadDriver(id: string | undefined): HeadToHeadDriver | undefined {
        const item = id ? this.driverList()?.Lines?.[id] : undefined;
        if (!id || !item) return undefined;
        const timingData = this.timingData()?.Lines?.[id];
        return {
            id,
            item,
            position: timingData?.Line ?? 0,
            timingData,
            timingStats: this.timingStats()?.Lines?.[id],
            timingAppData: this.timingAppData()?.Lines?.[id]
        };
    }

    private getChannels(id: string | undefined) {
        return id ? this.carData()?.[id]?.Channels : undefined;
    }

}
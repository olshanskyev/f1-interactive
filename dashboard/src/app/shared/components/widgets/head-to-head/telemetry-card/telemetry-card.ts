import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import { CarData } from '@core/types/f1types';
import { SpeedoComponent } from '@shared/components/speedo/speedo';
import { HeadToHeadDriver } from '../head-to-head-driver';
import { HeadToHeadDriverHeader } from '../driver-header/driver-header';

@Component({
  selector: 'head-to-head-telemetry-card',
  imports: [SpeedoComponent, KeyValuePipe, HeadToHeadDriverHeader],
  templateUrl: './telemetry-card.html',
  styleUrl: './telemetry-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeadToHeadTelemetryCard {
    readonly driver = input.required<HeadToHeadDriver>();
    readonly channels = input<CarData['Channels']>();

    readonly rpm = computed(() => this.channels()?.[0] ?? 0);
    readonly speed = computed(() => this.channels()?.[2] ?? 0);
    readonly gear = computed(() => this.channels()?.[3] ?? 0);
    readonly throttle = computed(() => this.channels()?.[4] ?? 0);
    readonly brake = computed(() => this.channels()?.[5] ?? 0);
}

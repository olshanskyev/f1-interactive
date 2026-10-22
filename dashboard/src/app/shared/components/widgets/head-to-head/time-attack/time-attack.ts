import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { BestLapTime } from '@core/types/f1types';
import { SimpleDriverCard } from '@shared/components/driver-card/simple-driver-card';
import { HeadToHeadDriver } from '../head-to-head-driver';
import { HeadToHeadDriverSkeleton } from '../driver-skeleton/driver-skeleton';
import { HeadToHeadTimeAttackCard } from './time-attack-card';

@Component({
  selector: 'head-to-head-time-attack',
  imports: [TranslateModule, SimpleDriverCard, HeadToHeadDriverSkeleton, HeadToHeadTimeAttackCard],
  templateUrl: './time-attack.html',
  styleUrl: './time-attack.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeadToHeadTimeAttack {
    readonly bestLapTime = input<BestLapTime>();
    readonly bestDriver = input<HeadToHeadDriver>();
    readonly driver1 = input<HeadToHeadDriver>();
    readonly driver2 = input<HeadToHeadDriver>();

    readonly drivers = computed(() =>
        [this.driver1(), this.driver2()].filter((driver): driver is HeadToHeadDriver => !!driver));
}

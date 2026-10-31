import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SectorsItem } from '@core/types/f1types';
import { MiniSectorsChip } from '../mini-sectors-chip/mini-sectors-chip';

@Component({
  selector: 'sector-chip',
  templateUrl: './sector-chip.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MiniSectorsChip],
})
export class SectorChip {
  readonly sector = input<SectorsItem>();
}

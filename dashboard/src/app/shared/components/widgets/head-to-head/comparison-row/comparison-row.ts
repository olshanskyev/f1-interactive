import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IntervalPipe } from '@shared/pipes';

@Component({
  selector: 'head-to-head-comparison-row',
  imports: [IntervalPipe],
  templateUrl: './comparison-row.html',
  styleUrl: './comparison-row.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeadToHeadComparisonRow {
    readonly name = input.required<string>();
    readonly firstValue = input<string>();
    readonly secondValue = input<string>();
}

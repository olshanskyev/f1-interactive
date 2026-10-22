import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'head-to-head-driver-skeleton',
  imports: [TranslateModule],
  template: `
    <div class="head-to-head-skeleton">
        <div>{{'widget.select_driver' | translate}}</div>
    </div>
  `,
  styleUrl: './driver-skeleton.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeadToHeadDriverSkeleton {}

import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DriverSelectionService } from '@core/services/driver-selection.service';
import { SimpleDriverCard } from '@shared/components/driver-card/simple-driver-card';
import { HeadToHeadDriver } from '../head-to-head-driver';

@Component({
  selector: 'head-to-head-driver-header',
  imports: [SimpleDriverCard, MatButtonModule, MatIconModule],
  templateUrl: './driver-header.html',
  styles: ':host { display: contents; }',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeadToHeadDriverHeader {
    private readonly driverSelectionService = inject(DriverSelectionService);

    readonly driver = input.required<HeadToHeadDriver>();

    deselect() {
        this.driverSelectionService.deselect(this.driver().id);
    }
}

import { DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { countryCode } from '@core/lib/country';
import { Round } from '@core/types/schedule';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'gp-card',
  templateUrl:'./gp-card.html',
  styleUrls: ['./gp-card.scss'],
  imports: [
    DatePipe,
    MatIconModule,
    TranslateModule,
    MatButtonModule,
    RouterLink
  ]
})
export class GpCard {

  round = input.required<Round>();
  isNext = input.required<boolean>();
  isOver = computed(() =>
    new Date(this.round().end) < new Date()
  );

  countryCode = computed(() =>
    countryCode(this.round().countryName)
  );

  isLive = computed(() => {
    // current time is between round start and end
    const now = new Date();
    const start = new Date(this.round().start);
    const end = new Date(this.round().end);
    return now >= start && now <= end;
  });
}

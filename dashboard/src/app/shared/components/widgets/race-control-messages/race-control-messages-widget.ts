import { Component, computed, signal } from '@angular/core';
import { ContaineredWidget } from '../containered-widget';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule, DatePipe } from '@angular/common';
import { sortUtc } from '@core/lib/sorting';
import { Message } from '@core/types/f1types';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'race-control-messages-widget',
  standalone: true,
  imports: [MatIconModule, MatCheckboxModule, CommonModule, DatePipe, TranslateModule],
  templateUrl: './race-control-messages-widget.html',
  styleUrl: './race-control-messages-widget.scss',
  host: {
    // set data-containered attribute when the widget is inside a container
    '[attr.data-containered]': 'container ? "true" : null'
  }
})
export class RaceControlMessagesWidget extends ContaineredWidget {
  showMessages = signal(true);
  messagesSignal = this.liveService.getRaceControlMessagesSignal();

  messages = computed(() => {
    const data = this.messagesSignal();
    if (!data?.Messages) return [];

    return Object.values(data.Messages)
      .sort(sortUtc)
      .map(msg => ({
        ...msg,
        computedIconColor: this.getIconColor(msg),
        computedIcon: this.getIconByMessage(msg)
      }));
  });

  private getIconColor(message: Message) {
    switch (message.Flag) {
      case 'YELLOW':
      case 'DOUBLE YELLOW':
        return 'var(--f1-yellow)';
      case 'RED':
        return 'var(--f1-red)';
      case 'BLUE':
        return 'var(--f1-blue)';
      case 'GREEN':
      case 'CLEAR':
        return 'var(--f1-green)';
    }

    switch (message.Category) {
      case 'SafetyCar':
        return 'var(--f1-yellow)';
      default:
        return 'var(--second-color)';
    }
  }

  private getIconByMessage(message: Message) {
    switch (message.Category) {
      case 'Flag':
        if (message.Flag === 'CHEQUERED') {
          return 'sports_score';
        }
        return 'flag';
      case 'SafetyCar':
        return 'minor_crash';
      default:
        return 'fmd_bad';
    }
  }

}

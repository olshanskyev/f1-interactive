import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, input, signal, WritableSignal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

export interface Digit {
  value: string;
  tick: boolean;
}

@Component({
  selector: 'session-countdown',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './session-countdown.html',
  styleUrl: './session-countdown.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionCountdown implements OnInit, OnDestroy {

  target = input.required<string | Date>();
  onTimerEnd = output<void>();

  daysRemaining = signal<Digit[]>([]);
  hours = signal<Digit[]>([]);
  minutes = signal<Digit[]>([]);
  seconds = signal<Digit[]>([]);

  hasDays = signal(false);

  private sub?: Subscription;

  ngOnInit(): void {
    this.start();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private parseTarget(): number | null {
    const target = this.target();
    const t = typeof target === 'string' ? new Date(target) : target;
    return t instanceof Date && !isNaN(t.getTime()) ? t.getTime() : null;
  }

  private start(): void {
    if (!this.parseTarget()) return;
    this.updateRemaining();
    this.sub = interval(1000).subscribe(() => this.updateRemaining());
  }

  private updateDigits(signalRef: WritableSignal<Digit[]>, newValue: number, padStart = 2): void {
    const newStr = newValue.toString().padStart(padStart, '0');
    const newDigits = newStr.split('');
    const current = signalRef();

    let changed = false;
    const next = newDigits.map((char, i) => {
      const isChanged = current.length > 0 && (current[i] == null || current[i].value !== char);
      if (isChanged) changed = true;
      return { value: char, tick: isChanged };
    });

    signalRef.set(next);

    if (changed) {
      setTimeout(() => {
        signalRef.update(digits => digits.map(d => ({ ...d, tick: false })));
      }, 400); // clear tick classes after animation completes
    }
  }

  private updateRemaining(): void {
    const targetTs = this.parseTarget();
    if (!targetTs) return;
    const diff = Math.max(0, targetTs - Date.now());
    const totalSeconds = Math.floor(diff / 1000);
    const secs = totalSeconds % 60;
    const mins = Math.floor(totalSeconds / 60) % 60;
    const hrs = Math.floor(totalSeconds / 3600) % 24;
    const days = Math.floor(totalSeconds / 86400);

    this.updateDigits(this.daysRemaining, days, 0); // days no padding or custom padding
    this.hasDays.set(days > 0);
    this.updateDigits(this.hours, hrs);
    this.updateDigits(this.minutes, mins);
    this.updateDigits(this.seconds, secs);

    if (diff === 0) {
      this.sub?.unsubscribe();
      this.onTimerEnd.emit();
    }
  }
}

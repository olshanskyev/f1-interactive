import { Component, input, computed, ChangeDetectionStrategy, effect, signal } from '@angular/core';

@Component({
  selector: 'speedo',
  templateUrl: './speedo.html',
  styleUrls: ['./speedo.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpeedoComponent {
  // Inputs as signals
  public speed = input<number>(0);
  public rpm = input<number>(0);
  public gear = input<number>(0);
  public throttle = input<number>(0); // 0 to 100
  public brake = input<number>(0); // 0 to 100

  // Display signals for smooth number transitions
  public displaySpeed = signal<number>(0);
  public displayRpm = signal<number>(0);
  public displayThrottle = signal<number>(0);

  public readonly circumference = 2 * Math.PI * 90 * (300 / 360);
  public readonly throttleCircumference = 2 * Math.PI * 75 * (190 / 360);
  public readonly brakeCircumference = 2 * Math.PI * 75 * (100 / 360);

  public readonly maxSpeed = 360;

  private activeAnimations = new Map<any, number>();

  constructor() {
    // Smoothen the speed number
    effect(() => {
      const targetSpeed = this.speed();
      this.animateValue(this.displaySpeed, targetSpeed);
    });

    // Smoothen the rpm number
    effect(() => {
      const targetRpm = this.rpm();
      this.animateValue(this.displayRpm, targetRpm);
    });

    // Smoothen the throttle number
    effect(() => {
      const targetThrottle = this.throttle();
      this.animateValue(this.displayThrottle, targetThrottle);
    });
  }

  private animateValue(sig: any, target: number) {
    const current = sig();
    if (current === target) return;

    // Cancel previous animation frame for this signal
    if (this.activeAnimations.has(sig)) {
      cancelAnimationFrame(this.activeAnimations.get(sig)!);
    }

    const duration = 300; // time in ms
    const start = performance.now();
    let lastRenderTime = start;

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutQuad roughly matches the CSS cubic-bezier output
      const easeProgress = 1 - (1 - progress) * (1 - progress);
      const nextValue = current + (target - current) * easeProgress;

      // Throttle visual text updates to ~20fps (50ms)
      if (now - lastRenderTime >= 50 || progress === 1) {
        lastRenderTime = now;
        if (sig() !== Math.round(nextValue)) {
          sig.set(Math.round(nextValue));
        }
      }

      if (progress < 1) {
        this.activeAnimations.set(sig, requestAnimationFrame(step));
      } else {
        this.activeAnimations.delete(sig);
      }
    };

    this.activeAnimations.set(sig, requestAnimationFrame(step));
  }

  public speedDashOffset = computed(() => {
    // Clamp speed between 0 and maxSpeed
    const currentSpeed = Math.min(Math.max(this.speed(), 0), this.maxSpeed);
    const progress = currentSpeed / this.maxSpeed;
    // Push the offset slightly further (+15) when empty to hide the rounded SVG cap
    const hideCapOffset = 15 * (1 - progress);
    return this.circumference - (progress * this.circumference) + hideCapOffset;
  });

  public throttleDashOffset = computed(() => {
    const currentThrottle = Math.min(Math.max(this.throttle(), 0), 100);
    const progress = currentThrottle / 100;
    const hideCapOffset = 15 * (1 - progress);
    return this.throttleCircumference - (progress * this.throttleCircumference) + hideCapOffset;
  });

  public brakeDashOffset = computed(() => {
    // If brake is positive, full arc is shown (dashOffset = 0)
    // If zero, empty arc is pushed 15px over circumference to hide the SVG round cap
    return (this.brake() > 0) ? 0 : this.brakeCircumference + 15;
  });
}

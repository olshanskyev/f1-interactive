import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'interval',
})
export class IntervalPipe implements PipeTransform {
  // takes values in format 1:24.553 or 24.635 and returns the difference as string in format 0.123 and sign + or -
  transform(firstValue: string, secondValue: string) {
    const firstTime = this.convertToSeconds(firstValue);
    const secondTime = this.convertToSeconds(secondValue);
    const interval = firstTime - secondTime;
    const sign = interval >= 0 ? '+' : '-';
    return {
      sign,
      value: Math.abs(interval).toFixed(3)
    };
  }

  private convertToSeconds(time: string): number {
    // check if there is no :
    if (!time.includes(':')) {
      return parseFloat(time);
    }
    const [minutes, seconds] = time.split(':').map(Number);
    return minutes * 60 + seconds;
  }
}

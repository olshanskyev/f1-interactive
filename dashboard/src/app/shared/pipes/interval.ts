import { Pipe, PipeTransform } from '@angular/core';
import { lapTimeToSeconds, toInterval } from '@core/lib/lap-time';

@Pipe({
  name: 'interval',
})
export class IntervalPipe implements PipeTransform {
  // takes values in format 1:24.553 or 24.635 and returns the difference as string in format 0.123 and sign + or -
  transform(firstValue: string, secondValue: string) {
    return toInterval(lapTimeToSeconds(firstValue) - lapTimeToSeconds(secondValue));
  }
}

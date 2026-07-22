import { KeyValuePipe } from '@angular/common';
import { Component, input, ChangeDetectionStrategy, PipeTransform, Pipe } from '@angular/core';
import { SegmentsItem } from '@core/types/f1types';
import { keepOrder } from '@core/lib/arrays-maps';

const SEGMENT_CLASS_MAP = new Map<number, string>([
  [2048, 'bg-f1-yellow'],
  [2052, 'bg-f1-yellow'],
  [2049, 'bg-f1-green'],
  [2051, 'bg-f1-purple'],
  [2064, 'bg-f1-blue'],
]);

@Pipe({
  name: 'segmentClass',
  standalone: true
})
export class SegmentClassPipe implements PipeTransform {
  transform(status?: number): string {
    if (status === undefined) return 'bg-color-inactive';
    return SEGMENT_CLASS_MAP.get(status) ?? 'bg-color-inactive';
  }
}

@Component({
    selector: 'mini-sectors-chip',
    templateUrl: './mini-sectors-chip.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        KeyValuePipe,
        SegmentClassPipe
    ],
})
export class MiniSectorsChip {
    segments = input<Record<number, SegmentsItem>>();

    keepOrder = keepOrder;
}
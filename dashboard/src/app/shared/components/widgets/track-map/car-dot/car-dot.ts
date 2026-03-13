import { Component, computed, input, NO_ERRORS_SCHEMA, ChangeDetectionStrategy } from '@angular/core';
import { rotate } from '@core/lib/map';
import { PositionCar } from '@core/types/f1types';

@Component({
    selector: 'g[car-dot]',
    templateUrl: './car-dot.html',
    styleUrl: './car-dot.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    schemas: [NO_ERRORS_SCHEMA],
    host: {
        '[class.dot]': 'true',
        '[class.hidden]': 'hidden()',
        '[class.no-transition]': 'disableTransition()',
        '[class.opacity-30]': 'pit()',
        '[style.transform]': 'transform()',
        '[style.fill]': 'color()',
    },
})
export class CarDot {
    disableTransition = input<boolean>(false);
    favouriteDriver = input<boolean>(false);
    name = input<string>('');
    color = input<string>('');
    pit = input<boolean>(false);
    hidden = input<boolean>(false);
    pos = input<PositionCar>({ X: 0, Y: 0, Z: 0, Status: 'OnTrack' });
    rotation = input<number>(0);
    centerX = input<number>(0);
    centerY = input<number>(0);

    rotatedPos = computed(() => {
        return rotate(this.pos().X, this.pos().Y, this.rotation(), this.centerX(), this.centerY());
    });
    transform = computed(() => {
        return [`translateX(${this.rotatedPos().x}px)`, `translateY(${this.rotatedPos().y}px)`].join(' ');
    });
}
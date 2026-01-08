import { Directive, OnDestroy, input, ElementRef, AfterViewInit, output } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
  selector: '[debounceClick]',
  standalone: true
})
export class DebounceClickDirective implements OnDestroy, AfterViewInit {
    debounceClick = output<any>();
    debounceTimeMs = input(500); // Customizable debounce time
    private subscription?: Subscription;
  
    constructor(private elementRef: ElementRef) {}
    ngAfterViewInit(): void {
        const eventStream$ = fromEvent(this.elementRef.nativeElement, 'click').pipe(
            debounceTime(this.debounceTimeMs())
        );
        this.subscription = eventStream$.subscribe(event => this.debounceClick.emit(event));
    }

    ngOnDestroy() {
        if (this.subscription)
            this.subscription.unsubscribe();
    }
}
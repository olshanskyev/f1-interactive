import { Directive, input, model, numberAttribute, ElementRef, inject, effect } from '@angular/core';

@Directive({
    selector: 'input[debounceTime]',
    host: {
        '(input)': 'onInput($event.target.value)'
    }
})
export class DebounceTime {
    private debounceTimer: any;
    readonly debounceTime = input(0, {transform: numberAttribute});
    readonly debouncedValue = model<string>();
    private readonly elementRef = inject(ElementRef);

    constructor() {
        effect(() => {
            const value = this.debouncedValue();
            if (this.elementRef.nativeElement.value !== value) {
               this.elementRef.nativeElement.value = value || '';
            }
        });
    }

    onInput(newValue: string) {
        clearTimeout(this.debounceTimer);
        if (!newValue || !this.debounceTime()) {
            this.debouncedValue.set(newValue);
        } else {
            this.debounceTimer = setTimeout(() => {
                this.debouncedValue.set(newValue);
            }, this.debounceTime());
        }
    }
}
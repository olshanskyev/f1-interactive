import { effect, Signal, signal } from '@angular/core';

type Entries<T> = Record<string, T>;
type Stack<T> = {
    Timestamp: string;
    Entries: Entries<T>;
}[];

export class StackContainer<T> {

    private newValue = signal<Entries<T>>({} as Entries<T>);
    // Cancellation token for event emission
    private emitId = 0;

    private emitNext(stackEntry: Stack<T>, index: number, currentEmitId: number) {
        if (index >= stackEntry.length) {
            return;
        }
        // Check cancellation
        if (currentEmitId !== this.emitId) {
            return;
        }
        const entry = stackEntry[index];
        const delay = index === 0 ? 0 :
            new Date(entry.Timestamp).getTime() -
            new Date(stackEntry[index - 1].Timestamp).getTime();
        setTimeout(() => {
            // Check cancellation again before emitting
            if (currentEmitId !== this.emitId) {
                return;
            }
            this.newValue.set(entry.Entries);
            this.emitNext(stackEntry, index + 1, currentEmitId);
        }, delay);
    }

    constructor(sourceSignal: Signal<Stack<T>>) {
        effect(() => {
            const sourceValues = sourceSignal();
            // Increment emitId to cancel previous emissions
            this.emitId++;
            if (sourceValues) {
                this.emitNext(sourceValues, 0, this.emitId);
            }
        });
    }

    public liveValue() {
        return this.newValue.asReadonly();
    }
}
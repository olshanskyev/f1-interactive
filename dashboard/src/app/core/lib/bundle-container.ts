import { effect, Signal, signal } from '@angular/core';

type Entries<T> = Record<string, T>;
type Bundle<T> = {
    Timestamp: string;
    Entries: Entries<T>;
}[];

export class BundleContainer<T> {

    private newValue = signal<Entries<T>>({} as Entries<T>);
    // Cancellation token for event emission
    private emitId = 0;

    private emitNext(bundleEntry: Bundle<T>, index: number, currentEmitId: number) {
        if (index >= bundleEntry.length) {
            return;
        }
        // Check cancellation
        if (currentEmitId !== this.emitId) {
            return;
        }
        const entry = bundleEntry[index];
        const delay = index === 0 ? 0 :
            new Date(entry.Timestamp).getTime() -
            new Date(bundleEntry[index - 1].Timestamp).getTime();
        setTimeout(() => {
            // Check cancellation again before emitting
            if (currentEmitId !== this.emitId) {
                return;
            }
            this.newValue.set(entry.Entries);
            this.emitNext(bundleEntry, index + 1, currentEmitId);
        }, delay);
    }

    constructor(sourceSignal: Signal<Bundle<T>>) {
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
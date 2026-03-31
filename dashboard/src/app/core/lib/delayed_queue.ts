import { UpdateEventRecord } from "@core/services/live/live.service";

export class DelayedQueue {
    private queue = new Map<number, UpdateEventRecord[]>();
    private callback: (value: UpdateEventRecord) => void;
    private delayMs = 0;
    private timer: ReturnType<typeof setTimeout> | null = null;

    constructor(callback: (value: UpdateEventRecord) => void, delayMs = 0) {
        this.callback = callback;
        this.delayMs = delayMs;
    }

    private emitNext() {
        if (!this.queue || this.queue.size === 0) return;

        const now = Date.now();
        let next = this.queue.entries().next();

        while (!next.done) {
            const [timestamp, values] = next.value;

            if (timestamp <= now) {
                // Time has passed, emit synchronously to catch up
                for (const v of values) {
                    this.callback(v);
                }
                this.queue.delete(timestamp);
                next = this.queue.entries().next();
            } else {
                // Next item is in the future, schedule it
                this.timer = setTimeout(() => {
                    this.timer = null;
                    this.emitNext();
                }, timestamp - now);
                return;
            }
        }
    }

    private emitAllPast() {
        const now = Date.now();
        // operate on a snapshot of entries to avoid iterator issues
        for (const [timestamp, values] of Array.from(this.queue.entries())) {
            if (timestamp <= now) {
                for (const v of values) {
                    this.callback(v);
                }
                this.queue.delete(timestamp);
            }
        }
    }

    public add(value: UpdateEventRecord) {
        if (this.delayMs <= 0) {
            this.callback(value);
            return;
        }
        const timestamp = value.utc + this.delayMs;
        const wasEmpty = this.queue.size === 0;
        const bucket = this.queue.get(timestamp);
        if (bucket) {
            bucket.push(value);
        } else {
            this.queue.set(timestamp, [value]);
        }
        if (wasEmpty) {
            this.emitNext();
        }
    }

    public setDelay(delayMs: number) {
        const delayDiff = delayMs - this.delayMs;
        this.delayMs = delayMs;
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        const newQueue = new Map<number, UpdateEventRecord[]>();
        // Recalculate timestamps based on new delay
        for (const [timestamp, values] of this.queue) {
            const newTs = timestamp + delayDiff;
            const existing = newQueue.get(newTs);
            if (existing) {
                existing.push(...values);
            } else {
                newQueue.set(newTs, [...values]);
            }
        }
        this.queue = newQueue;
        this.emitAllPast();
        if (this.queue.size > 0) {
            this.emitNext();
        }
    }

    public clear() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.queue.clear();
    }
}
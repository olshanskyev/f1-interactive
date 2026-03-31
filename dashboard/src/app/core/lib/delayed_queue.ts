import { UpdateEventRecord } from '@core/services/live/live.service';

export class DelayedQueue {
    private data = new Map<number, UpdateEventRecord[]>();
    private sortedTimestamps: number[] = [];

    private timer: ReturnType<typeof setTimeout> | null = null;

    constructor(
        private callback: (value: UpdateEventRecord) => void,
        private delayMs = 0
    ) {}


    private insertSorted(timestamp: number): number {
        const len = this.sortedTimestamps.length;

        // optimization for the common case where events arrive in order
        if (len === 0 || timestamp > this.sortedTimestamps[len - 1]) {
            this.sortedTimestamps.push(timestamp);
            return len; // Return the index of the last element
        }
        // Optimization: If the new timestamp is smaller than the first one
        if (timestamp < this.sortedTimestamps[0]) {
            this.sortedTimestamps.unshift(timestamp);
            return 0; // Return the index of the first element
        }

        // In all other rare cases (an "event from the past"), use binary search
        let low = 0;
        let high = len;
        while (low < high) {
            const mid = (low + high) >>> 1;
            if (this.sortedTimestamps[mid] < timestamp) low = mid + 1;
            else high = mid;
        }

        this.sortedTimestamps.splice(low, 0, timestamp);
        return low;
    }

    public add(value: UpdateEventRecord) {
        if (this.delayMs <= 0) {
            this.callback(value);
            return;
        }

        const timestamp = value.utc + this.delayMs;
        const bucket = this.data.get(timestamp);

        if (bucket) {
            bucket.push(value);
        } else {
            this.data.set(timestamp, [value]);
            const index = this.insertSorted(timestamp);
            // If the new timestamp is the earliest, reset the timer to ensure timely processing
            if (index === 0) {
                this.resetTimer();
            }
        }

        // If the process is not running, start it
        if (!this.timer && this.sortedTimestamps.length > 0) {
            this.processQueue();
        }
    }

    private processQueue() {
        if (this.sortedTimestamps.length === 0) return;

        const now = Date.now();

        while (this.sortedTimestamps.length > 0) {
            const nextTs = this.sortedTimestamps[0];

            if (nextTs <= now) {
                // Extract and process all events for this timestamp
                const values = this.data.get(nextTs);
                if (values) {
                    for (const v of values) {
                        this.callback(v);
                    }
                }

                // Clear processed events
                this.data.delete(nextTs);
                this.sortedTimestamps.shift();
            } else {
                // Next event is in the future, schedule the timer
                this.timer = setTimeout(() => {
                    this.timer = null;
                    this.processQueue();
                }, nextTs - now);
                break;
            }
        }
    }

    private resetTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.processQueue();
    }

    public setDelay(newDelayMs: number) {
        const diff = newDelayMs - this.delayMs;
        this.delayMs = newDelayMs;

        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }

        const newData = new Map<number, UpdateEventRecord[]>();
        const newTimestamps: number[] = [];

        // recalculate timestamps based on new delay and reinsert into the queue
        for (const ts of this.sortedTimestamps) {
            const newTs = ts + diff;
            const values = this.data.get(ts)!;
            newData.set(newTs, values);
            newTimestamps.push(newTs);
        }

        this.data = newData;
        this.sortedTimestamps = newTimestamps;

        this.processQueue();
    }

    public clear() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.data.clear();
        this.sortedTimestamps = [];
    }
}
export interface Interval {
    sign: '+' | '-';
    value: string;
}

// accepts times in format 1:24.553 or 24.635
export function lapTimeToSeconds(time: string): number {
    if (!time.includes(':')) {
        return parseFloat(time);
    }
    const [minutes, seconds] = time.split(':').map(Number);
    return minutes * 60 + seconds;
}

export function toInterval(seconds: number): Interval {
    return {
        sign: seconds >= 0 ? '+' : '-',
        value: Math.abs(seconds).toFixed(3)
    };
}

import { TimingDataLinesItem } from '@core/types/f1types';

interface UtcObject { Utc: string }
export const sortUtc = (a: UtcObject, b: UtcObject) => {
	return new Date(b.Utc).getTime() - new Date(a.Utc).getTime();
};

export const sortTimingDataByPosition = (lines: Record<string, TimingDataLinesItem>) => {
	 return new Map(
          Object.entries(lines).sort(
            (([ , a], [ , b]) => a.Line - b.Line)
          )
        );
};

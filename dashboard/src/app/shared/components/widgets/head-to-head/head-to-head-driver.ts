import { DriverListItem, TimingAppDataLinesItem, TimingDataLinesItem, TimingStatsLinesItem } from '@core/types/f1types';

export interface HeadToHeadDriver {
    id: string;
    item: DriverListItem;
    position: number;
    timingData?: TimingDataLinesItem;
    timingStats?: TimingStatsLinesItem;
    timingAppData?: TimingAppDataLinesItem;
}

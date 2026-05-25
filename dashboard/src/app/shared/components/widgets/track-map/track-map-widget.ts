import { Component, computed, inject, linkedSignal, signal, OnDestroy, Signal, ChangeDetectionStrategy } from '@angular/core';
import { ContaineredWidget } from '../containered-widget';
import { CircuitService, DriverSelectionService } from '@core';
import { createMapPoints, createMiniSectors, createSectors, findYellowSectors, getSectorColor, MapSector, MiniSector, prioritizeColoredSectors, rad, rotate } from '@core/lib/map';
import { getTrackStatusMessage } from '@core/lib/track-status-message';
import { TrackPosition } from '@core/types/map.type';

import { CarDot } from './car-dot/car-dot';
import { CarPosition, SegmentsItem } from '@core/types/f1types';
import { of, tap } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';

interface Corner {
	number: number;
	pos: TrackPosition;
	labelPos: TrackPosition;
}

@Component({
    selector: 'track-map-widget',
    styleUrl:'./track-map-widget.scss',
    templateUrl: './track-map-widget.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CarDot,
        TranslateModule
    ]
})
export class TrackMapWidget extends ContaineredWidget implements OnDestroy {

    private readonly circuitService = inject(CircuitService);
    private readonly driverSelectionService = inject(DriverSelectionService);
    private sessionInfo = this.liveService.getSessionInfoSignal();
    private sessionInfoKey = computed(() => this.sessionInfo()?.Meeting.Circuit.Key);

    private raceControlMessages = this.liveService.getRaceControlMessagesSignal();
    private trackStatus = this.liveService.getTrackStatusSignal();
    private driverList = this.liveService.getDriverListSignal();
    private timingData = this.liveService.getTimingDataSignal();
    selectedDrivers = this.driverSelectionService.getSelectedDrivers();

    positions = computed(() => {
        if (this.liveService.isPositionZAvailable()) {
            return this.liveService.getPositionsLiveSignal('max')();
        } else {
            return this.getPositionsBySegmentsSignal()();
        }
    });

    center = signal<{ x: number; y: number } | null>(null);
    bounds = signal<{ minX: number; minY: number; widthX: number; widthY: number } | null>(null);
    points = signal<{ x: number; y: number }[] | null>(null);
    sectors = signal<MapSector[]>([]);
    corners = signal<Corner[]>([]);
    rotation = signal<number>(0);
    finishLine = signal<{ x: number; y: number; startAngle: number } | null>(null);
    trackPoints = signal<TrackPosition[]>([]);
    miniSectors = signal<MiniSector[]>([]);

    showCornerNumbers = computed(() => this.settings()?.['showCornerNumbers'] ?? true);

    private yellowSectors = computed(() => {
        return findYellowSectors(this.raceControlMessages()?.Messages);
    });

    renderedSectors = computed(() => {
        const status = getTrackStatusMessage(this.trackStatus()?.Status ?
         parseInt(this.trackStatus()!.Status) :
         undefined);
        return this.sectors()
			.map((sector) => {
				const color = getSectorColor(sector,
                    status?.bySector,
                    status?.trackColor,
                    this.yellowSectors());
				return {
					color,
					pulse: status?.pulse,
					number: sector.number,
					strokeWidth: color === 'stroke-white' ?
                        this.STROKE_WIDTH :
                        this.STROKE_WIDTH * 2,
					d: `M${sector.points[0].x},${sector.points[0].y} ${sector.points.map((point) => `L${point.x},${point.y}`).join(' ')}`,
				};
			})
			.sort(prioritizeColoredSectors);
	});


    joinedPoints = computed(() => {
        const pts = this.points();
        if (!pts || pts.length === 0) return '';
        return 'M' + pts[0].x + ',' + pts[0].y + ' ' + pts.map((point) => 'L' + point.x + ',' + point.y).join(' ');
    });

    driverDots = linkedSignal(() => {
        const activePositions = this.positions();
        const selectedSet = this.selectedDrivers();
        const normalDots: any[] = [];
        const selectedDots: any[] = [];

        Object.values(this.driverList()?.Lines ?? {})
            .reverse() //ToDo? make sorting based on position (at the momeent based on driver number)
            .forEach((driver) => {
                const num = driver.RacingNumber;
                const timingData = this.timingData()?.Lines?.[num];
                const hidden = timingData
                    ? timingData.KnockedOut || timingData.Stopped || timingData.Retired
                    : false;

                const pos = activePositions?.[num];
                const onTrack = !((pos?.X ?? 0) === 0 && (pos?.Y ?? 0) === 0);

                const dot = {
                    driver,
                    hidden,
                    onTrack,
                    pit: timingData ? timingData.InPit : false
                };

                selectedSet.has(num)?
                    selectedDots.push(dot):
                    normalDots.push(dot);
        });

        return [...normalDots, ...selectedDots];
    });

    mapResource = rxResource({
        params: () => this.sessionInfoKey(),
        stream: ({ params }) => {
            if (!params) return of([]);
            return this.circuitService.getMap(params).pipe(
                tap((res) => this.mapCalculation(res))
            );
        }
    });

    constructor() {
        super();

        // Listen for page visibility changes to force immediate car-dot update
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
        window.addEventListener('pageshow', this.handleVisibilityChange); // for mobile browsers that discard the page when in background
    }

    // Clean up event listener
    ngOnDestroy(): void {
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        window.removeEventListener('pageshow', this.handleVisibilityChange);
    }

    disableTransition = signal(false);

    // Handler to force immediate update of car-dot positions without jumping
    private handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
            this.disableTransition.set(true);
            setTimeout(() => {
                this.disableTransition.set(false);
            }, 200); // disable transitions shortly after gaining visibility to prevent jumping
        }
    };

    private readonly ROTATION_FIX = 90;
    private readonly SPACE = 1000;
    private readonly CORNER_LABEL_DISTANCE = 500;
    private readonly STROKE_WIDTH = 60;

    mapCalculation(mapJson: any) {
        const centerX = (Math.max(...mapJson.x) - Math.min(...mapJson.x)) / 2;
        const centerY = (Math.max(...mapJson.y) - Math.min(...mapJson.y)) / 2;

        const fixedRotation = mapJson.rotation + this.ROTATION_FIX;

        const sectors = createSectors(mapJson).map((s) => ({
            ...s,
            start: rotate(s.start.x, s.start.y, fixedRotation, centerX, centerY),
            end: rotate(s.end.x, s.end.y, fixedRotation, centerX, centerY),
            points: s.points.map((p) => rotate(p.x, p.y, fixedRotation, centerX, centerY)),
        }));

        const cornerPositions: Corner[] = mapJson.corners.map((corner: any) => ({
            number: corner.number,
            pos: rotate(
                corner.trackPosition.x,
                corner.trackPosition.y,
                fixedRotation, centerX, centerY),
            labelPos: rotate(
                corner.trackPosition.x + this.CORNER_LABEL_DISTANCE * Math.cos(rad(corner.angle)),
                corner.trackPosition.y + this.CORNER_LABEL_DISTANCE * Math.sin(rad(corner.angle)),
                fixedRotation,
                centerX,
                centerY,
            ),
        }));

        const rotatedPoints = mapJson.x.map((x: any, index: any) =>
            rotate(x, mapJson.y[index], fixedRotation, centerX, centerY));

        const pointsX = rotatedPoints.map((item: any) => item.x);
        const pointsY = rotatedPoints.map((item: any) => item.y);

        const cMinX = Math.min(...pointsX) - this.SPACE;
        const cMinY = Math.min(...pointsY) - this.SPACE;
        const cWidthX = Math.max(...pointsX) - cMinX + this.SPACE * 2;
        const cWidthY = Math.max(...pointsY) - cMinY + this.SPACE * 2;

        const rotatedFinishLine = rotate(
            mapJson.x[0], mapJson.y[0], fixedRotation, centerX, centerY);

        const dx = rotatedPoints[3].x - rotatedPoints[0].x;
        const dy = rotatedPoints[3].y - rotatedPoints[0].y;

        const startAngle = Math.atan2(dy, dx) * (180 / Math.PI);

        this.center.set({ x: centerX, y: centerY });
        this.bounds.set({ minX: cMinX, minY: cMinY, widthX: cWidthX, widthY: cWidthY });
        this.sectors.set(sectors);
        this.trackPoints.set(createMapPoints(mapJson));
        this.miniSectors.set(createMiniSectors(mapJson));
        this.points.set(rotatedPoints);
        this.rotation.set(fixedRotation);
        this.corners.set(cornerPositions);
        this.finishLine.set({ x: rotatedFinishLine.x, y: rotatedFinishLine.y, startAngle });
    }

    private findLastCompletedSegment(allSegments: SegmentsItem[]) {
        let foundIndex = -1;
        for (let i = allSegments.length - 1; i >= 0; i--) {
            const status = allSegments[i].Status;
            if (status > 0) {
                foundIndex = i;
                break;
            }

        }
        return foundIndex;
    }

    /**
     * try to calculate position
     * 1. based on mini sectors from map.miniSectorsIndexes (if number of mini sectors is the same as number of segments in timing data)
     * 2. based on ratio of completed segments to total segments and applying that ratio to track points (fallback if mini sectors data is not available or doesn't match segments count)
     * @returns
     */
    private getPositionsBySegmentsSignal(): Signal<Record<string, CarPosition> | undefined> {
        return computed(() => {
            const timingData = this.timingData();

            if (!timingData || this.trackPoints().length === 0) return undefined;
            const res: Record<string, CarPosition> = {};
            Object.entries(timingData.Lines).forEach(([driverId, itemTimingData]) => {
                if (itemTimingData.Sectors) {
                    const allSegments = Object.values(itemTimingData.Sectors).flatMap(
                        (sector) => (sector.Segments ?
                            Object.values(sector.Segments) : [])
                    );
                    const segmentIndex = this.findLastCompletedSegment(allSegments);
                    if (segmentIndex !== -1) {
                        let trackPoint: TrackPosition;
                        if (this.miniSectors().length < allSegments.length) {
                            const ratio = (segmentIndex + 1) / Math.max(allSegments.length, 1);
                            const positionIndex = Math.floor(
                                ratio * (this.trackPoints().length - 1)
                            );
                            trackPoint = this.trackPoints()[positionIndex];
                        } else {
                            trackPoint = {
                                x: this.miniSectors()[segmentIndex]?.end.x ?? 0,
                                y: this.miniSectors()[segmentIndex]?.end.y ?? 0
                            };
                        }

                        res[driverId] = {
                            Status: '',
                            X: trackPoint.x,
                            Y: trackPoint.y,
                            Z: 0
                        };
                    } else {
                        res[driverId] = {
                            Status: '',
                            X: 0,
                            Y: 0,
                            Z: 0
                        };
                    }
                }
            });
            return res;
        });
    }


}
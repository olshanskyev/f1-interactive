
import { Message } from '@core/types/f1types';
import { Map, TrackPosition } from '@core/types/map.type';
import { sortUtc } from './sorting';

export const rad = (deg: number) => deg * (Math.PI / 180);

export const rotate = (x: number, y: number, a: number, px: number, py: number) => {
	const c = Math.cos(rad(a));
	const s = Math.sin(rad(a));

	x -= px;
	y -= py;

	const newX = x * c - y * s;
	const newY = y * c + x * s;

	return { y: newX + px, x: newY + py };
};

export const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

export const findMinDistance = (point: TrackPosition, points: TrackPosition[]) => {
	let min = Infinity;
	let minIndex = -1;
	for (let i = 0; i < points.length; i++) {
		const distance = calculateDistance(point.x, point.y, points[i].x, points[i].y);
		if (distance < min) {
			min = distance;
			minIndex = i;
		}
	}
	return minIndex;
};

export interface MiniSector {
	number: number;
	start: TrackPosition;
	end: TrackPosition;
}
export interface MapSector {
	number: number;
	start: TrackPosition;
	end: TrackPosition;
	points: TrackPosition[];
}

// ToDo check miniSectorIndexes. why it sometimes < than timingData.Sectors.Segments length??
export const createMiniSectors = (map: Map): MiniSector[] => {
	if (!map.miniSectorsIndexes || map.miniSectorsIndexes.length === 0)
		return [];
	const sectors: MiniSector[] = [];
	sectors.push({
		number: 1,
		start: {x: map.x[0], y: map.y[0]},
		end: {x: map.x[map.miniSectorsIndexes[0]], y: map.y[map.miniSectorsIndexes[0]]},
	});
	for (let i = 1; i <= map.miniSectorsIndexes.length; i++) {
		sectors.push({
			number: i + 1,
			start: {
				x: map.x[map.miniSectorsIndexes[i - 1]],
				y: map.y[map.miniSectorsIndexes[i - 1]]},
			end: (i === map.miniSectorsIndexes.length) ?
				{x: map.x[0], y: map.y[0]} :
				{x: map.x[map.miniSectorsIndexes[i]], y: map.y[map.miniSectorsIndexes[i]]},
		});
	}
	return sectors;
};

export const createMapPoints = (map: Map) => {
	return map.x.map((x, index) => ({ x, y: map.y[index] }));
};

export const createSectors = (map: Map): MapSector[] => {
	const sectors: MapSector[] = [];
	const points: TrackPosition[] = createMapPoints(map);
	for (let i = 0; i < map.marshalSectors.length; i++) {
		sectors.push({
			number: i + 1,
			start: map.marshalSectors[i].trackPosition,
			end: map.marshalSectors[i + 1] ?
				map.marshalSectors[i + 1].trackPosition :
				map.marshalSectors[0].trackPosition,
			points: [],
		});
	}

	const dividers: number[] = sectors.map((s) =>
		findMinDistance(s.start, points));

	for (let i = 0; i < dividers.length; i++) {
		const start = dividers[i];
		const end = dividers[i + 1] ? dividers[i + 1] : dividers[0];
		if (start < end) {
			sectors[i].points = points.slice(start, end + 1);
		} else {
			sectors[i].points = points.slice(start).concat(points.slice(0, end + 1));
		}
	}

	return sectors;
};

export const findYellowSectors = (messages: Record<number, Message> | undefined): Set<number> => {
	const msgs = messages ? Object.values(messages).sort(sortUtc).filter((msg) => {
		return msg.Flag === 'YELLOW' || msg.Flag === 'DOUBLE YELLOW' || msg.Flag === 'CLEAR';
	}) : undefined;
	if (!msgs) {
		return new Set();
	}

	const done = new Set<number>();
	const sectors = new Set<number>();
	for (const msg of msgs) {
		if (msg.Scope === 'Track' && msg.Flag !== 'CLEAR') {
			// Spam with sectors so all sectors are yellow no matter what
			// number of sectors there really are
			for (let j = 0; j < 100; j++) {
				sectors.add(j);
			}
			return sectors;
		}
		if (msg.Scope === 'Sector') {
			if (!msg.Sector || done.has(msg.Sector)) {
				continue;
			}
			if (msg.Flag === 'CLEAR') {
				done.add(msg.Sector);
			} else {
				sectors.add(msg.Sector);
			}
		}
	}
	return sectors;
};

interface RenderedSector {
	number: number;
	d: string;
	color: string;
	strokeWidth: number;
	pulse?: number;
}

export const prioritizeColoredSectors = (a: RenderedSector, b: RenderedSector) => {
	if (a.color === 'stroke-white' && b.color !== 'stroke-white') {
		return -1;
	}
	if (a.color !== 'stroke-white' && b.color === 'stroke-white') {
		return 1;
	}
	return a.number - b.number;
};

export const getSectorColor = (
	sector: MapSector,
	bySector: boolean | undefined,
	trackColor: string | undefined = 'stroke-white',
	yellowSectors: Set<number>,
) => (bySector ? (yellowSectors.has(sector.number) ? trackColor : 'stroke-white') : trackColor);

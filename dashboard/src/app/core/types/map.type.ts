export interface Map {
	corners: Corner[];
	marshalLights: Corner[];
	marshalSectors: Corner[];
	candidateLap: CandidateLap;
	circuitKey: number;
	circuitName: string;
	countryIocCode: string;
	countryKey: number;
	countryName: string;
	location: string;
	meetingKey: string;
	meetingName: string;
	meetingOfficialName: string;
	miniSectorsIndexes: number[];
	raceDate: string;
	rotation: number;
	round: number;
	trackPositionTime: number[];
	x: number[];
	y: number[];
	year: number;
}

export interface CandidateLap {
	driverNumber: string;
	lapNumber: number;
	lapStartDate: string;
	lapStartSessionTime: number;
	lapTime: number;
	session: string;
	sessionStartTime: number;
}

export interface Corner {
	angle: number;
	length: number;
	number: number;
	trackPosition: TrackPosition;
}

export interface TrackPosition {
	x: number;
	y: number;
}

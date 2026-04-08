
export interface Root {
	Heartbeat?: Heartbeat;
	ExtrapolatedClock?: ExtrapolatedClock;
	TopThree?: TopThree;
	TimingStats?: TimingStats;
	TimingAppData?: TimingAppData;
	WeatherData?: WeatherData;
	TrackStatus?: TrackStatus;
    DriverList?: DriverList;
    RaceControlMessages?: RaceControlMessages;
    SessionInfo?: SessionInfo;
	SessionData?: SessionData;
    SessionStatus?: SessionStatus;
	LapCount?: LapCount;
	TimingData?: TimingData;
	TeamRadio?: TeamRadio;
    PitLaneTimeCollection?: PitLaneTimeCollection;
	'CarData.z'?: string;
	'Position.z'?: string;
	ContentStreams?: ContentStreams;
    AudioStreams?: AudioStreams;
	ChampionshipPrediction?: ChampionshipPrediction;
}

export interface Heartbeat {
	Utc: string;
}

export interface ExtrapolatedClock {
	Utc: string;
	Remaining: string;
	Extrapolating: boolean;
}

export interface TopThree {
	Withheld: boolean;
    Lines: Record<number, TopThreeLinesItem>;
	SessionPart: number;
}

export interface TopThreeLinesItem {
	Position: string;
	ShowPosition: boolean;
	RacingNumber: string;
	Tla: string;
	BroadcastName: string;
	FullName: string;
    FirstName: string;
    LastName: string;
    Reference: string;
	Team: string;
	TeamColour: string;
	LapTime: string;
	LapState: number;
	DiffToAhead: string;
	DiffToLeader: string;
	OverallFastest: boolean;
	PersonalFastest: boolean;
}

export interface TimingStats {
	Withheld: boolean;
	Lines: Record<string, TimingStatsLinesItem>;
	SessionType: string;
}

export interface TimingStatsLinesItem {
	Line: number;
	RacingNumber: string;
	PersonalBestLapTime: PersonalBestLapTime;
	BestSectors: Record<number, BestSectorsItem>;
	BestSpeeds: Record<string, BestSpeedsItem>;
}

export interface PersonalBestLapTime {
    Lap: number;
    Position: number;
	Value: string;
	_deleted: Record<number, string>;
}

export interface BestSectorsItem {
    Position: number;
	Value: string;
}

export interface BestSpeedsItem {
    Position: number;
	Value: string;
}

export interface TimingAppData {
	Lines: Record<string, TimingAppDataLinesItem>;
}

export interface TimingAppDataLinesItem {
	RacingNumber: string;
	Line: number;
	GridPos: string;
    Stints: Record<number, Stint>;
}

export interface Stint {
    LapTime: string;
    LapNumber: number;
    LapFlags: number;
	Compound: 'SOFT' | 'MEDIUM' | 'HARD' | 'INTERMEDIATE' | 'WET' | 'UNKNOWN' | 'TEST_UNKNOWN';
	New: string; // TRUE | FALSE
    TyresNotChanged: string;
    TotalLaps: number;
    StartLaps: number;
}

export interface WeatherData {
	AirTemp: string;
	Humidity: string;
	Pressure: string;
	Rainfall: string;
	TrackTemp: string;
	WindDirection: string;
	WindSpeed: string;
}

export interface TrackStatus {
	Status: string;
	Message: string;
}

export interface DriverList {
    Lines: Record<string, DriverListItem>
}

export interface DriverListItem {
	RacingNumber: string;
	BroadcastName: string;
	FullName: string;
	Tla: string;
	Line: number;
	TeamName: string;
	TeamColour: string;
	FirstName: string;
	LastName: string;
	Reference: string;
	HeadshotUrl: string;
	PublicIdRight: string;
	_deleted: Record<number, string>;
}

export interface RaceControlMessages {
	Messages: Record<number, Message>;
}

export interface Message {
	Utc: string;
	Lap: number;
	Category: 'Other' | 'Sector' | 'Flag' | 'Drs' | 'SafetyCar' | string;
	Flag: 'BLACK AND WHITE' | 'BLUE' | 'CLEAR' | 'YELLOW' | 'GREEN' | 'DOUBLE YELLOW' | 'RED' | 'CHEQUERED';
	Scope: 'Driver' | 'Track' | 'Sector';
    Message: string;
	Sector: number;
	Status: 'ENABLED' | 'DISABLED';
    Mode: string;
    RacingNumber: string;
}

export interface SessionInfo {
	Meeting: Meeting;
    SessionStatus: string;
	ArchiveStatus: ArchiveStatus;
	Key: number;
	Type: string;
    Number: number;
	Name: string;
	StartDate: string;
	EndDate: string;
	GmtOffset: string;
	Path: string;
}

export interface Meeting {
	Key: number;
	Name: string;
	OfficialName: string;
	Location: string;
    Number: number;
	Country: Country;
	Circuit: Circuit;
}

export interface ArchiveStatus {
	Status: string;
}

export interface Circuit {
	Key: number;
	ShortName: string;
}

export interface Country {
	Key: number;
	Code: string;
	Name: string;
}

export interface SessionData {
    Series: Record<number, Series>;
    StatusSeries: Record<number, StatusSeries>;
}

export type SessinStatusType = 'Inactive' | 'Started' | 'Finished' | 'Finalised' | 'Ends' | 'Aborted';

export interface StatusSeries {
	Utc: string;
	TrackStatus: string;
	SesionStatus: SessinStatusType;
}

export interface Series {
	Utc: string;
	Lap: number;
	QualifyingPart: number;
}

export interface SessionStatus {
	Status: SessinStatusType;
    Started: string;
}

export interface LapCount {
	CurrentLap: number;
	TotalLaps: number;
}

export interface StatItem {
	TimeDifftoPositionAhead: string;
    TimeDiffToFastest: string;
}

export interface TimingData {
	Lines: Record<string, TimingDataLinesItem>;
	Withheld?: boolean;
	NoEntries: Record<number, number>;
	SessionPart: number;
	CutOffTime: string;
	CutOffPercentage: string;
}

export interface TimingDataLinesItem {
	GapToLeader: string;
    IntervalToPositionAhead: IntervalToPositionAhead;
    TimeDiffToFastest: string;
	TimeDiffToPositionAhead: string;
	Line: number;
	Position: string;
	ShowPosition: boolean;
	RacingNumber: string;
	Retired: boolean;
	InPit: boolean;
	PitOut: boolean;
	Stopped: boolean;
	Status: number;
    NumberOfLaps: number;
    NumberOfPitStops: number;
	Sectors: Record<number, SectorsItem>;
	Speeds: Record<string, SpeedsItem>;
	BestLapTime: BestLapTime;
	LastLapTime: LastLapTime;

	KnockedOut: boolean;
	Cutoff: boolean;
	BestLapTimes: Record<number, BestLapTime>;
	Stats: Record<number, StatItem>;
}

export interface SectorsItem {
	Stopped: boolean;
    PreviousValue: string;
    Segments: Record<number, SegmentsItem>;
	Value: string;
	Status: number;
	OverallFastest: boolean;
	PersonalFastest: boolean;
}

export interface SpeedsItem {
    Position: number;
	Value: string;
	Status: number;
	OverallFastest: boolean;
	PersonalFastest: boolean;
}

export interface SegmentsItem {
    Status: number;
}

export interface BestLapTime {
    Value: string;
    Lap: number;
	_deleted: Record<number, string>;
}

export interface LastLapTime {
    Value: string;
    Status: number;
    OverallFastest: boolean;
	PersonalFastest: boolean;
}


export interface IntervalToPositionAhead {
    Value: string;
    Catching: boolean;
}

export interface TeamRadio {
    Captures: Record<number, Capture>;
}

export interface Capture {
	Utc: string;
	RacingNumber: string;
	Path: string;
}

export interface PitLaneTimeCollection {
    PitTimes: PitTimes;
}

export interface PitTimes {
    Lines: Record<string, PitTimesItem>;
    _deleted: string[];
}

export interface PitTimesItem {
    RacingNumber: string;
    Duration: string;
    Lap: string;
}

export interface ContentStreams {
	Streams: Record<number, Stream>
}

export interface AudioStreams {
	Streams: Record<number, Stream>
}

export interface Stream {
	Type: string;
	Name: string;
	Language: string;
	Uri: string;
	Path: string;
	Utc: string | Date;
}


//Position.z
export interface PositionZ {
	Position: PositionItem[];
}

interface PositionItem {
	Timestamp: string;
	Entries: Record<string, CarPosition>;
}

export interface CarPosition {
	Status: string;
	X: number;
	Y: number;
	Z: number;
}

//CarData.z
export interface CarDataZ {
	Entries: CarItem[];
}

interface CarItem {
	Utc: string;
	Cars: Record<string, CarData>;
}

export interface CarData {
	Channels: {
		/** 0 - RPM */
		0: number;
		/** 2 - Speed number km/h */
		2: number;
		/** 3 - gear number */
		3: number;
		/** 4 - Throttle int 0-100 (104 - Calibration or Inactive state?)*/
		4: number;
		/** 5 - Brake number boolean (104 - Calibration or Inactive state?)*/
		5: number;
	};
}

export interface DriverPredictionItem {
	RacingNumber: string;
	CurrentPosition: string;
	PredictedPosition: string;
	CurrentPoints: string;
	PredictedPoints: string;
}

export interface TeamPredictionItem {
	TeamName: string;
	CurrentPosition: string;
	PredictedPosition: string;
	CurrentPoints: string;
	PredictedPoints: string;
}

export interface ChampionshipPrediction {
	Drivers: Record<string, DriverPredictionItem>;
	Teams: Record<string, TeamPredictionItem>;
}
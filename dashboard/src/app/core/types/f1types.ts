
export type Root = {
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
};

export type Heartbeat = {
	Utc: string;
};

export type ExtrapolatedClock = {
	Utc: string;
	Remaining: string;
	Extrapolating: boolean;
};

export type TopThree = {
	Withheld: boolean;
    Lines: {
		[key: number]: TopThreeLinesItem;
	};
};

export type TopThreeLinesItem = {
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
};

export type TimingStats = {
	Withheld: boolean;
	Lines: {
		[key: string]: TimingStatsLinesItem;
	};
	SessionType: string;
};

export type TimingStatsLinesItem = {
	Line: number;
	RacingNumber: string;
	PersonalBestLapTime: PersonalBestLapTime;
	BestSectors: {
        [key: number]: BestSectorsItem;
    }
	BestSpeeds: {
		[key: string]: BestSpeedsItem;
	};
};

export type PersonalBestLapTime = {
    Lap: number;
    Position: number;
	Value: string;
};

export type BestSectorsItem = {
    Position: number;
	Value: string;
};

export type BestSpeedsItem = {
    Position: number;
	Value: string;
};

export type TimingAppData = {
	Lines: {
		[key: string]: TimingAppDataLinesItem;
	};
};

export type TimingAppDataLinesItem = {
	RacingNumber: string;
	Line: number;
	GridPos: string;
    Stints: {
        [key: number]: Stint;
    }
};

export type Stint = {
    LapTime: string;
    LapNumber: number;
    LapFlags: number;
	Compound: "SOFT" | "MEDIUM" | "HARD" | "INTERMEDIATE" | "WET" | "UNKNOWN";
	New: string; // TRUE | FALSE
    TyresNotChanged: string;
    TotalLaps: number;
    StartLaps: number;
};

export type WeatherData = {
	AirTemp: string;
	Humidity: string;
	Pressure: string;
	Rainfall: string;
	TrackTemp: string;
	WindDirection: string;
	WindSpeed: string;
};

export type TrackStatus = {
	Status: string;
	Message: string;
};

export type DriverList = {
    Lines: {
        [key: string]: DriverListItem;
    }
};

export type DriverListItem = {
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
};

export type RaceControlMessages = {
	Messages: {
        [key: number]: Message;
    }
};

export type Message = {
	Utc: string;
	Lap: number;
	Category: "Other" | "Sector" | "Flag" | "Drs" | "SafetyCar" | string;
	Flag: "BLACK AND WHITE" | "BLUE" | "CLEAR" | "YELLOW" | "GREEN" | "DOUBLE YELLOW" | "RED" | "CHEQUERED";
	Scope: "Driver" | "Track" | "Sector";
    Message: string;
	Sector: number;
	Status: "ENABLED" | "DISABLED";
    Mode: string;
    RacingNumber: string;
};

export type SessionInfo = {
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
};

export type Meeting = {
	Key: number;
	Name: string;
	OfficialName: string;
	Location: string;
    Number: number;
	Country: Country;
	Circuit: Circuit;
};

export type ArchiveStatus = {
	Status: string;
};

export type Circuit = {
	Key: number;
	ShortName: string;
};

export type Country = {
	Key: number;
	Code: string;
	Name: string;
};

export type SessionData = {
    Series: {
        [key: number]: Series;
    }
    StatusSeries: {
        [key: number]: StatusSeries;
    }
};

export type SessinStatusType = "Inactive" | "Started" | "Finished" | "Finalised" | "Ends";

export type StatusSeries = {
	Utc: string;
	TrackStatus: string;
	SesionStatus: SessinStatusType;
};

export type Series = {
	Utc: string;
	Lap: number;
};

export type SessionStatus = {
	Status: SessinStatusType;
    Started: string;
};

export type LapCount = {
	CurrentLap: number;
	TotalLaps: number;
};

export type TimingData = {
	Lines: {
		[key: string]: TimingDataLinesItem;
	};
	Withheld?: boolean;
};

export type TimingDataLinesItem = {
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
	Sectors: {
        [key: number]: SectorsItem;
    };
	Speeds: {
        [key: string]: SpeedsItem;
    };
	BestLapTime: BestLapTime;
	LastLapTime: LastLapTime;
};

export type SectorsItem = {
	Stopped: boolean;
    PreviousValue: string;
    Segments: {
		[key: number]: SegmentsItem;
	};
	Value: string;
	Status: number;
	OverallFastest: boolean;
	PersonalFastest: boolean;
};

export type SpeedsItem = {
    Position: number;
	Value: string;
	Status: number;
	OverallFastest: boolean;
	PersonalFastest: boolean;
};

export type SegmentsItem = {
    Status: number;
}

export type BestLapTime = {
    Value: string;
    Lap: number;
};

export type LastLapTime = {
    Value: string;
    Status: number;
    OverallFastest: boolean;
	PersonalFastest: boolean;
};


export type IntervalToPositionAhead = {
    Value: string;
    Catching: boolean;
}

export type TeamRadio = {
    Captures: {
        [key: number]: Capture;
    }
};

export type Capture = {
	Utc: string;
	RacingNumber: string;
	Path: string;
};

export type PitLaneTimeCollection = {
    PitTimes: PitTimes;
};

export type PitTimes = {
    Lines: {
        [key: string]: PitTimesItem;
    };
    _deleted: string[];
}

export type PitTimesItem = {
    RacingNumber: string;
    Duration: string;
    Lap: string;
}
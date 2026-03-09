package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Root{
    @JsonProperty("Heartbeat") 
    public Heartbeat heartbeat;
    @JsonProperty("ExtrapolatedClock") 
    public ExtrapolatedClock extrapolatedClock;
    @JsonProperty("TopThree") 
    public TopThree topThree;
    @JsonProperty("TimingStats") 
    public TimingStats timingStats;
    @JsonProperty("TimingAppData")
    public TimingAppData timingAppData;
    @JsonProperty("WeatherData") 
    public WeatherData weatherData;
    @JsonProperty("TrackStatus") 
    public TrackStatus trackStatus;
    @JsonProperty("DriverList")
    public DriverList driverList;
    @JsonProperty("RaceControlMessages") 
    public RaceControlMessages raceControlMessages;
    @JsonProperty("SessionInfo") 
    public SessionInfo sessionInfo;
    @JsonProperty("SessionData") 
    public SessionData sessionData;
    @JsonProperty("SessionStatus") 
    public SessionStatus sessionStatus;
    @JsonProperty("LapCount") 
    public LapCount lapCount;
    @JsonProperty("TimingData")
    public TimingData timingData;
    @JsonProperty("TeamRadio") 
    public TeamRadio teamRadio;
    @JsonProperty("PitLaneTimeCollection") 
    public PitLaneTimeCollection pitLaneTimeCollection;
    @JsonProperty("ContentStreams")
    public ContentStreams contentStreams;
    @JsonProperty("AudioStreams")
    public AudioStreams audioStreams;
    @JsonProperty("CarData.z")
    public CarDataZ carDataZ;
    @JsonProperty("Position.z")
    public PositionZ positionZ;
    @JsonProperty("ChampionshipPrediction")
    public ChampionshipPrediction championshipPrediction;
}

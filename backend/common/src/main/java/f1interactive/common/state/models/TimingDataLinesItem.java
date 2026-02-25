package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import f1interactive.common.state.models.deserializer.ArrayIntoMapDeserializer;

import java.util.LinkedHashMap;

public class TimingDataLinesItem {
    @JsonProperty("GapToLeader")
    public String gapToLeader;
    @JsonProperty("IntervalToPositionAhead")
    public IntervalToPositionAhead intervalToPositionAhead;
    @JsonProperty("TimeDiffToFastest")
    public String timeDiffToFastest;
    @JsonProperty("TimeDiffToPositionAhead")
    public String timeDiffToPositionAhead;
    @JsonProperty("Line")
    public Integer line;
    @JsonProperty("Position")
    public String position;
    @JsonProperty("ShowPosition")
    public Boolean showPosition;
    @JsonProperty("RacingNumber")
    public String racingNumber;
    @JsonProperty("Retired")
    public Boolean retired;
    @JsonProperty("InPit")
    public Boolean inPit;
    @JsonProperty("PitOut")
    public Boolean pitOut;
    @JsonProperty("Stopped")
    public Boolean stopped;
    @JsonProperty("Status")
    public Integer status;
    @JsonProperty("NumberOfLaps")
    public Integer numberOfLaps;
    @JsonProperty("NumberOfPitStops")
    public Integer numberOfPitStops;
    @JsonProperty("Sectors")
    @JsonDeserialize(using = ArrayIntoMapDeserializer.class)
    public LinkedHashMap<Integer, SectorsItem> sectors = new LinkedHashMap<>();
    @JsonProperty("Speeds")
    public LinkedHashMap<String, SpeedsItem> speeds = new LinkedHashMap<>();
    @JsonProperty("BestLapTime")
    public BestLapTime bestLapTime;
    @JsonProperty("LastLapTime")
    public LastLapTime lastLapTime;

    @JsonProperty("KnockedOut")
    public Boolean knockedOut;
    @JsonProperty("Cutoff")
    public Boolean cutOff;
    @JsonProperty("BestLapTimes")
    @JsonDeserialize(using = ArrayIntoMapDeserializer.class)
    public LinkedHashMap<Integer, BestLapTime> bestLapTimes = new LinkedHashMap<>();
    @JsonProperty("Stats")
    @JsonDeserialize(using = ArrayIntoMapDeserializer.class)
    public LinkedHashMap<Integer, StatItem> stats = new LinkedHashMap<>();

}

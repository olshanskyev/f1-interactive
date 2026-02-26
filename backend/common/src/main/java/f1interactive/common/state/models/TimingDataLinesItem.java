package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import f1interactive.common.state.models.deserializer.ArrayWrapperDeserializer;
import f1interactive.common.state.models.deserializer.ArrayWrapperSerializer;
import tools.jackson.databind.annotation.JsonDeserialize;
import tools.jackson.databind.annotation.JsonSerialize;

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
    @JsonDeserialize(using = ArrayWrapperDeserializer.class)
    @JsonSerialize(using = ArrayWrapperSerializer.class)
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    public ArrayWrapper<Integer, SectorsItem> sectors = new ArrayWrapper<>();
    @JsonProperty("Speeds")
    public LinkedHashMap<String, SpeedsItem> speeds;
    @JsonProperty("BestLapTime")
    public BestLapTime bestLapTime;
    @JsonProperty("LastLapTime")
    public LastLapTime lastLapTime;

    @JsonProperty("KnockedOut")
    public Boolean knockedOut;
    @JsonProperty("Cutoff")
    public Boolean cutOff;
    @JsonProperty("BestLapTimes")
    @JsonDeserialize(using = ArrayWrapperDeserializer.class)
    @JsonSerialize(using = ArrayWrapperSerializer.class)
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    public ArrayWrapper<Integer, BestLapTime> bestLapTimes = new ArrayWrapper<>();
    @JsonProperty("Stats")
    @JsonDeserialize(using = ArrayWrapperDeserializer.class)
    @JsonSerialize(using = ArrayWrapperSerializer.class)
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    public ArrayWrapper<Integer, StatItem> stats = new ArrayWrapper<>();

}

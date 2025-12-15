package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import f1interactive.common.state.models.deserializer.ArrayIntoMapDeserializer;

import java.util.LinkedHashMap;

public class TimingStatsLinesItem {
    @JsonProperty("Line")
    public Integer line;
    @JsonProperty("RacingNumber")
    public String racingNumber;
    @JsonProperty("PersonalBestLapTime")
    public PersonalBestLapTime personalBestLapTime;
    @JsonProperty("BestSectors")
    @JsonDeserialize(using = ArrayIntoMapDeserializer.class)
    public LinkedHashMap<Integer, BestSectorsItem> bestSectors = new LinkedHashMap<>();
    @JsonProperty("BestSpeeds")
    public LinkedHashMap<String, BestSpeedsItem> bestSpeeds = new LinkedHashMap<>();
}

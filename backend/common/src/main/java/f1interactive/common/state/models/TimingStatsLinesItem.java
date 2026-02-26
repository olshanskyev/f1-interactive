package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import f1interactive.common.state.models.deserializer.ArrayWrapperDeserializer;
import f1interactive.common.state.models.deserializer.ArrayWrapperSerializer;
import tools.jackson.databind.annotation.JsonDeserialize;
import tools.jackson.databind.annotation.JsonSerialize;

import java.util.LinkedHashMap;

public class TimingStatsLinesItem {
    @JsonProperty("Line")
    public Integer line;
    @JsonProperty("RacingNumber")
    public String racingNumber;
    @JsonProperty("PersonalBestLapTime")
    public PersonalBestLapTime personalBestLapTime;
    @JsonProperty("BestSectors")
    @JsonDeserialize(using = ArrayWrapperDeserializer.class)
    @JsonSerialize(using = ArrayWrapperSerializer.class)
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    public ArrayWrapper<Integer, BestSectorsItem> bestSectors = new ArrayWrapper<>();
    @JsonProperty("BestSpeeds")
    public LinkedHashMap<String, BestSpeedsItem> bestSpeeds;
}

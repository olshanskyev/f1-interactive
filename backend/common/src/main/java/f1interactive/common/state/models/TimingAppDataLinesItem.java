package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import f1interactive.common.state.models.deserializer.ArrayIntoMapDeserializer;

import java.util.LinkedHashMap;

public class TimingAppDataLinesItem {
    @JsonProperty("RacingNumber")
    public String racingNumber;
    @JsonProperty("Line")
    public Integer line;
    @JsonProperty("GridPos")
    public String gridPos;
    @JsonProperty("Stints")
    @JsonDeserialize(using = ArrayIntoMapDeserializer.class)
    public LinkedHashMap<Integer, Stint> stints = new LinkedHashMap<>();
}

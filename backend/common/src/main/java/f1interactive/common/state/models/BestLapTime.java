package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class BestLapTime{
    @JsonProperty("Value")
    public String value;
    @JsonProperty("Lap") 
    public Integer lap;
}

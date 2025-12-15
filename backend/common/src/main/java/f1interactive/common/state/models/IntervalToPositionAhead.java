package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class IntervalToPositionAhead{
    @JsonProperty("Value")
    public String value;
    @JsonProperty("Catching") 
    public Boolean catching;
}

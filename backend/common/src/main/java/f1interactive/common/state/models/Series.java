package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

public class Series{
    @JsonProperty("Utc")
    public Date utc;
    @JsonProperty("Lap") 
    public Integer lap;
}

package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

public class Capture{
    @JsonProperty("Utc") 
    public Date utc;
    @JsonProperty("RacingNumber")
    public String racingNumber;
    @JsonProperty("Path") 
    public String path;
}

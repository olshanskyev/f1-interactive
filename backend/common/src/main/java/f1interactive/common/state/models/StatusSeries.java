package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

public class StatusSeries{
    @JsonProperty("Utc")
    public Date utc;
    @JsonProperty("TrackStatus") 
    public String trackStatus;
    @JsonProperty("SessionStatus") 
    public String sessionStatus;
}

package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Stint{
    @JsonProperty("LapTime") 
    public String lapTime;
    @JsonProperty("LapNumber") 
    public Integer lapNumber;
    @JsonProperty("LapFlags") 
    public Integer lapFlags;
    @JsonProperty("Compound") 
    public String compound;
    @JsonProperty("New")
    public String isNew;
    @JsonProperty("TyresNotChanged") 
    public String tyresNotChanged;
    @JsonProperty("TotalLaps") 
    public Integer totalLaps;
    @JsonProperty("StartLaps") 
    public Integer startLaps;
}

package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PitTimesItem {
    @JsonProperty("RacingNumber")
    public String racingNumber;
    @JsonProperty("Duration")
    public String duration;
    @JsonProperty("Lap")
    public String lap;
}

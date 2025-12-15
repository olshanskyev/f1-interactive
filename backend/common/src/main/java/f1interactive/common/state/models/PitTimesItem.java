package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;

public class PitTimesItem {
    @JsonProperty("RacingNumber")
    public String racingNumber;
    @JsonProperty("Duration")
    public String duration;
    @JsonProperty("Lap")
    public String lap;
}

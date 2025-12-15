package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SpeedsItem {
    @JsonProperty("Position")
    public Integer position;
    @JsonProperty("Value")
    public String value;
    @JsonProperty("Status")
    public Integer status;
    @JsonProperty("OverallFastest")
    public Boolean overallFastest;
    @JsonProperty("PersonalFastest")
    public Boolean personalFastest;
}

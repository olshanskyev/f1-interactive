package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class BestSpeedsItem {
    @JsonProperty("Position")
    public Integer position;
    @JsonProperty("Value")
    public String value;
}

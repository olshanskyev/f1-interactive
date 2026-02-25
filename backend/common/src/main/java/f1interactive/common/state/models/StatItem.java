package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class StatItem {
    @JsonProperty("TimeDifftoPositionAhead")
    public String timeDifftoPositionAhead;
    @JsonProperty("TimeDiffToFastest")
    public String timeDiffToFastest;
}

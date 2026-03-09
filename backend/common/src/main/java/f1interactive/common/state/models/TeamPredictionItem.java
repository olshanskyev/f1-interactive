package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TeamPredictionItem {

    @JsonProperty("TeamName")
    public String teamName;

    @JsonProperty("CurrentPosition")
    public String currentPosition;

    @JsonProperty("PredictedPosition")
    public String predictedPosition;

    @JsonProperty("CurrentPoints")
    public String currentPoints;

    @JsonProperty("PredictedPoints")
    public String predictedPoints;

}

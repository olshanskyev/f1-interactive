package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.LinkedHashMap;

public class DriverPredictionItem {

    @JsonProperty("RacingNumber")
    public String racingNumber;

    @JsonProperty("CurrentPosition")
    public String currentPosition;

    @JsonProperty("PredictedPosition")
    public String predictedPosition;

    @JsonProperty("CurrentPoints")
    public String currentPoints;

    @JsonProperty("PredictedPoints")
    public String predictedPoints;

}

package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class LapCount implements UpdateEvent{
    @JsonProperty("CurrentLap")
    public Integer currentLap;
    @JsonProperty("TotalLaps") 
    public Integer totalLaps;
    public Boolean _kf;

    @Override
    public Root merge(Root state) {
        if (state.lapCount == null)
            state.lapCount = new LapCount();
        if (currentLap != null)
            state.lapCount.currentLap = currentLap;
        if (totalLaps != null)
            state.lapCount.totalLaps = currentLap;

        return state;
    }
}

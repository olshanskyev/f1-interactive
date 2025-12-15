package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PitLaneTimeCollection implements UpdateEvent{
    @JsonProperty("PitTimes")
    public PitTimes pitTimes;
    public Boolean _kf;

    @Override
    public Root merge(Root state) {
        // !!! not merging deleted. how to deal with this value?
        if (pitTimes != null && !pitTimes.lines.isEmpty()) {
            if (state.pitLaneTimeCollection == null)
                state.pitLaneTimeCollection = new PitLaneTimeCollection();
            if (state.pitLaneTimeCollection.pitTimes == null)
                state.pitLaneTimeCollection.pitTimes = new PitTimes();

            state.pitLaneTimeCollection.pitTimes.lines.putAll(pitTimes.lines);
        }
        return state;
    }
}

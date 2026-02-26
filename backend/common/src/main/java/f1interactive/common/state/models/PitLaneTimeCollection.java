package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import f1interactive.common.state.models.merge.Merger;

public class PitLaneTimeCollection implements UpdateEvent{
    @JsonProperty("PitTimes")
    public PitTimes pitTimes;
    public Boolean _kf;

    @Override
    public Root merge(Root state) {
        // !!! not merging deleted. how to deal with this value?
        if (pitTimes != null) {
            if (state.pitLaneTimeCollection == null)
                state.pitLaneTimeCollection = new PitLaneTimeCollection();
            if (state.pitLaneTimeCollection.pitTimes == null)
                state.pitLaneTimeCollection.pitTimes = new PitTimes();
            state.pitLaneTimeCollection.pitTimes.lines = Merger.copyMapValues(pitTimes.lines, state.pitLaneTimeCollection.pitTimes.lines);
        }
        return state;
    }
}

package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import f1interactive.common.state.models.merge.Merger;

import java.util.LinkedHashMap;

public class TimingData implements UpdateEvent{
    @JsonProperty("Lines") 
    public LinkedHashMap<String, TimingDataLinesItem> lines = new LinkedHashMap<>();
    @JsonProperty("Withheld")
    public Boolean withheld;
    public Boolean _kf;

    @Override
    public Root merge(Root state) {
        if (state.timingData == null)
            state.timingData = new TimingData();
        Merger.mergeAllNotNull(state.timingData, this);
        return state;
    }
}

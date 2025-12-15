package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import f1interactive.common.state.models.merge.Merger;

import java.util.LinkedHashMap;

public class TimingAppData implements UpdateEvent{
    @JsonProperty("Lines")
    public LinkedHashMap<String, TimingAppDataLinesItem> lines = new LinkedHashMap<>();
    public Boolean _kf;

    @Override
    public Root merge(Root state) {
        if (state.timingAppData == null)
            state.timingAppData = new TimingAppData();
        Merger.mergeAllNotNull(state.timingAppData, this);
        return state;
    }
}

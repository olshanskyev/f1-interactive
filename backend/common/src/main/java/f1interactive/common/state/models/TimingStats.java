package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import f1interactive.common.state.models.merge.Merger;

import java.util.LinkedHashMap;

public class TimingStats implements UpdateEvent{
    @JsonProperty("Withheld")
    public Boolean withheld;
    @JsonProperty("Lines") 
    public LinkedHashMap<String, TimingStatsLinesItem> lines;
    @JsonProperty("SessionType") 
    public String sessionType;
    public Boolean _kf;

    @Override
    public Root merge(Root state) {
        if (state.timingStats == null)
            state.timingStats = new TimingStats();
        Merger.mergeAllNotNull(state.timingStats, this);
        return state;
    }
}

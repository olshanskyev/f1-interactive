package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import f1interactive.common.state.models.deserializer.ArrayIntoMapDeserializer;
import f1interactive.common.state.models.merge.Merger;

import java.util.LinkedHashMap;

public class TimingData implements UpdateEvent{
    @JsonProperty("Lines") 
    public LinkedHashMap<String, TimingDataLinesItem> lines = new LinkedHashMap<>();
    @JsonProperty("Withheld")
    public Boolean withheld;
    public Boolean _kf;

    @JsonProperty("NoEntries")
    @JsonDeserialize(using = ArrayIntoMapDeserializer.class)
    public LinkedHashMap<Integer, Integer> noEntries = new LinkedHashMap<>();

    @JsonProperty("SessionPart")
    public Integer sessionPart;
    @JsonProperty("CutOffTime")
    public String cutOffTime;
    @JsonProperty("CutOffPercentage")
    public String cutOffPercentage;
    @Override
    public Root merge(Root state) {
        if (state.timingData == null)
            state.timingData = new TimingData();
        Merger.mergeAllNotNull(state.timingData, this);
        return state;
    }
}

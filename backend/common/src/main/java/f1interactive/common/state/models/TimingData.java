package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import f1interactive.common.state.models.deserializer.ArrayWrapperDeserializer;
import f1interactive.common.state.models.deserializer.ArrayWrapperSerializer;
import f1interactive.common.state.models.merge.Merger;
import tools.jackson.databind.annotation.JsonDeserialize;
import tools.jackson.databind.annotation.JsonSerialize;

import java.util.LinkedHashMap;

public class TimingData implements UpdateEvent{
    @JsonProperty("Lines") 
    public LinkedHashMap<String, TimingDataLinesItem> lines;
    @JsonProperty("Withheld")
    public Boolean withheld;
    public Boolean _kf;

    @JsonProperty("NoEntries")
    @JsonDeserialize(using = ArrayWrapperDeserializer.class)
    @JsonSerialize(using = ArrayWrapperSerializer.class)
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    public ArrayWrapper<Integer, Integer> noEntries = new ArrayWrapper<>();

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

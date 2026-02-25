package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import f1interactive.common.state.models.deserializer.ArrayIntoMapDeserializer;
import f1interactive.common.state.models.merge.Merger;

import java.util.LinkedHashMap;

public class TopThree implements UpdateEvent{
    @JsonProperty("Withheld")
    public Boolean withheld;
    @JsonProperty("Lines")
    @JsonDeserialize(using = ArrayIntoMapDeserializer.class)
    public LinkedHashMap<Integer, TopThreeLinesItem> lines = new LinkedHashMap<>();
    public Boolean _kf;

    @JsonProperty("SessionPart")
    public Integer sessionPart;

    @Override
    public Root merge(Root state) {
        if (state.topThree == null)
            state.topThree = new TopThree();
        Merger.mergeAllNotNull(state.topThree, this);
        return state;
    }
}

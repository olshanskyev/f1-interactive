package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import f1interactive.common.state.models.deserializer.ArrayWrapperDeserializer;
import f1interactive.common.state.models.deserializer.ArrayWrapperSerializer;
import f1interactive.common.state.models.merge.Merger;
import tools.jackson.databind.annotation.JsonDeserialize;
import tools.jackson.databind.annotation.JsonSerialize;

public class TopThree implements UpdateEvent{
    @JsonProperty("Withheld")
    public Boolean withheld;
    @JsonProperty("Lines")
    @JsonDeserialize(using = ArrayWrapperDeserializer.class)
    @JsonSerialize(using = ArrayWrapperSerializer.class)
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    public ArrayWrapper<Integer, TopThreeLinesItem> lines = new ArrayWrapper<>();
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

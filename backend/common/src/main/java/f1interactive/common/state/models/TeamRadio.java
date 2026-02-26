package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;


import f1interactive.common.state.models.deserializer.ArrayWrapperDeserializer;
import f1interactive.common.state.models.deserializer.ArrayWrapperSerializer;
import f1interactive.common.state.models.merge.Merger;
import tools.jackson.databind.annotation.JsonDeserialize;
import tools.jackson.databind.annotation.JsonSerialize;


public class TeamRadio implements UpdateEvent{
    @JsonProperty("Captures")
    @JsonDeserialize(using = ArrayWrapperDeserializer.class)
    @JsonSerialize(using = ArrayWrapperSerializer.class)
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    public ArrayWrapper<Integer, Capture> captures = new ArrayWrapper<>();
    public Boolean _kf;

    @Override
    public Root merge(Root state) {
        if (state.teamRadio == null)
            state.teamRadio = new TeamRadio();
        if (this.captures.fullState) {
            state.teamRadio.captures.values = null;
        }
        state.teamRadio.captures.values = Merger.copyMapValues(this.captures.values, state.teamRadio.captures.values);
        return state;
    }
}

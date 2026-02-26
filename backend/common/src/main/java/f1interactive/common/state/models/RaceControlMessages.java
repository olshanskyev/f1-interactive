package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import f1interactive.common.state.models.deserializer.ArrayWrapperDeserializer;
import f1interactive.common.state.models.deserializer.ArrayWrapperSerializer;
import f1interactive.common.state.models.merge.Merger;
import tools.jackson.databind.annotation.JsonDeserialize;
import tools.jackson.databind.annotation.JsonSerialize;

public class RaceControlMessages implements UpdateEvent{
    @JsonProperty("Messages")
    @JsonDeserialize(using = ArrayWrapperDeserializer.class)
    @JsonSerialize(using = ArrayWrapperSerializer.class)
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    public ArrayWrapper<Integer, Message> messages = new ArrayWrapper<>();
    public Boolean _kf;

    @Override
    public Root merge(Root state) {
        if (state.raceControlMessages == null)
            state.raceControlMessages = new RaceControlMessages();

        if (this.messages.fullState) {
            state.raceControlMessages.messages.values = null;
        }
        state.raceControlMessages.messages.values = Merger.copyMapValues(this.messages.values, state.raceControlMessages.messages.values);
        return state;
    }
}

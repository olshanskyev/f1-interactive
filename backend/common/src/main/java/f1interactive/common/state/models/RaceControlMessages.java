package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import f1interactive.common.state.models.deserializer.ArrayIntoMapDeserializer;

import java.util.LinkedHashMap;

public class RaceControlMessages implements UpdateEvent{
    @JsonProperty("Messages")
    @JsonDeserialize(using = ArrayIntoMapDeserializer.class)
    public LinkedHashMap<Integer, Message> messages = new LinkedHashMap<>();
    public Boolean _kf;

    @Override
    public Root merge(Root state) {
        if (state.raceControlMessages == null)
            state.raceControlMessages = new RaceControlMessages();
        state.raceControlMessages.messages.putAll(this.messages);
        return state;
    }
}

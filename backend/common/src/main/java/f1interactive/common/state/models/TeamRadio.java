package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import f1interactive.common.state.models.deserializer.ArrayIntoMapDeserializer;

import java.util.LinkedHashMap;

public class TeamRadio implements UpdateEvent{
    @JsonProperty("Captures")
    @JsonDeserialize(using = ArrayIntoMapDeserializer.class)
    public LinkedHashMap<Integer, Capture> captures = new LinkedHashMap<>();
    public Boolean _kf;

    @Override
    public Root merge(Root state) {
        if (state.teamRadio == null)
            state.teamRadio = new TeamRadio();
        state.teamRadio.captures.putAll(this.captures);
        return state;
    }
}

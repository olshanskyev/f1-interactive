package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

public class Heartbeat implements UpdateEvent {
    @JsonProperty("Utc")
    public Date utc;
    public Boolean _kf;

    @Override
    public Root merge(Root state) {
        state.heartbeat = this;
        return state;
    }
}

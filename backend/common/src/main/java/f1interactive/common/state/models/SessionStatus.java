package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SessionStatus implements UpdateEvent{
    @JsonProperty("Status")
    public String status;
    @JsonProperty("Started") 
    public String started;
    public Boolean _kf;

    @Override
    public Root merge(Root state) {
        state.sessionStatus = this;
        return state;
    }
}

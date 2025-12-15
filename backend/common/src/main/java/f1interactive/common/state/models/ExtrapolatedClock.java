package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

public class ExtrapolatedClock implements UpdateEvent{
    @JsonProperty("Utc")
    public Date utc;
    @JsonProperty("Remaining") 
    public String remaining;
    @JsonProperty("Extrapolating") 
    public Boolean extrapolating;
    public Boolean _kf;

    @Override
    public Root merge(Root state) {
        state.extrapolatedClock = this;
        return state;
    }
}

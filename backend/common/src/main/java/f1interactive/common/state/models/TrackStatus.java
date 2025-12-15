package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TrackStatus implements UpdateEvent{
    @JsonProperty("Status")
    public String status;
    @JsonProperty("Message") 
    public String message;
    public Boolean _kf;

    @Override
    public Root merge(Root state) {
        state.trackStatus = this;
        return state;
    }
}

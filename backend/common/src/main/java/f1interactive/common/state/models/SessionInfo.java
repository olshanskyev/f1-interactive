package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

public class SessionInfo implements UpdateEvent{
    @JsonProperty("Meeting") 
    public Meeting meeting;
    @JsonProperty("SessionStatus") 
    public String sessionStatus;
    @JsonProperty("ArchiveStatus") 
    public ArchiveStatus archiveStatus;
    @JsonProperty("Key")
    public Integer key;
    @JsonProperty("Type") 
    public String type;
    @JsonProperty("Number")
    public Integer number;
    @JsonProperty("Name") 
    public String name;
    @JsonProperty("StartDate") 
    public Date startDate;
    @JsonProperty("EndDate") 
    public Date endDate;
    @JsonProperty("GmtOffset") 
    public String gmtOffset;
    @JsonProperty("Path") 
    public String path;
    public Boolean _kf;

    @Override
    public Root merge(Root state) {
        state.sessionInfo = this;
        return state;
    }
}

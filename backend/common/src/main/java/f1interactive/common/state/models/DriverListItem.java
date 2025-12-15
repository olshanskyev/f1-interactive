package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class DriverListItem{
    // workaround for _kf field
    public DriverListItem(boolean kf) {
    }
    public DriverListItem() {}

    @JsonProperty("RacingNumber")
    public String racingNumber;
	@JsonProperty("BroadcastName")
    public String broadcastName;
    @JsonProperty("FullName")
    public String fullName;
    @JsonProperty("Tla")
    public String tla;
	@JsonProperty("Line")
    public Integer line;
	@JsonProperty("TeamName")
    public String teamName;
    @JsonProperty("TeamColour")
    public String teamColour;
    @JsonProperty("FirstName")
    public String firstName;
    @JsonProperty("LastName")
    public String lastName;
    @JsonProperty("Reference")
    public String reference;
    @JsonProperty("HeadshotUrl")
    public String headshotUrl;
    @JsonProperty("PublicIdRight")
    public String publicIdRight;
}

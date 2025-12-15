package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TopThreeLinesItem {
    @JsonProperty("Position")
    public String position;
    @JsonProperty("ShowPosition")
    public Boolean showPosition;
    @JsonProperty("RacingNumber")
    public String racingNumber;
    @JsonProperty("Tla")
    public String tla;
    @JsonProperty("BroadcastName")
    public String broadcastName;
    @JsonProperty("FullName")
    public String fullName;
    @JsonProperty("FirstName")
    public String firstName;
    @JsonProperty("LastName")
    public String lastName;
    @JsonProperty("Reference")
    public String reference;
    @JsonProperty("Team")
    public String team;
    @JsonProperty("TeamColour")
    public String teamColour;
    @JsonProperty("LapTime")
    public String lapTime;
    @JsonProperty("LapState")
    public Integer lapState;
    @JsonProperty("DiffToAhead")
    public String diffToAhead;
    @JsonProperty("DiffToLeader")
    public String diffToLeader;
    @JsonProperty("OverallFastest")
    public Boolean overallFastest;
    @JsonProperty("PersonalFastest")
    public Boolean personalFastest;
}

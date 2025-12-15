package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

public class Message {
    @JsonProperty("Utc")
    public Date utc;
    @JsonProperty("Lap") 
    public Integer lap;
    @JsonProperty("Category") 
    public String category;
    @JsonProperty("Flag") 
    public String flag;
    @JsonProperty("Scope") 
    public String scope;
    @JsonProperty("Message") 
    public String message;
    @JsonProperty("Sector") 
    public Integer sector;
    @JsonProperty("Status") 
    public String status;
    @JsonProperty("Mode")
    public String mode;
    @JsonProperty("RacingNumber") 
    public String racingNumber;
}

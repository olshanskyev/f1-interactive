package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Meeting{
    @JsonProperty("Key") 
    public Integer key;
    @JsonProperty("Name")
    public String name;
    @JsonProperty("OfficialName") 
    public String officialName;
    @JsonProperty("Location") 
    public String location;
    @JsonProperty("Number") 
    public Integer number;
    @JsonProperty("Country") 
    public Country country;
    @JsonProperty("Circuit") 
    public Circuit circuit;
}

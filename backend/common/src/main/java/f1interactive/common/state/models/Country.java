package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Country{
    @JsonProperty("Key")
    public Integer key;
    @JsonProperty("Code") 
    public String code;
    @JsonProperty("Name") 
    public String name;
}

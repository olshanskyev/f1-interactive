package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Circuit{
    @JsonProperty("Key")
    public Integer key;
    @JsonProperty("ShortName") 
    public String shortName;
}

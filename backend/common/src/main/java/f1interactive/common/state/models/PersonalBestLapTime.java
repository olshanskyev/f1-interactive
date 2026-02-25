package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import f1interactive.common.state.models.deserializer.ArrayIntoMapDeserializer;

import java.util.LinkedHashMap;

public class PersonalBestLapTime{
    @JsonProperty("Lap")
    public Integer lap;
    @JsonProperty("Position") 
    public Integer position;
    @JsonProperty("Value") 
    public String value;

    @JsonProperty("_deleted")
    @JsonDeserialize(using = ArrayIntoMapDeserializer.class)
    public LinkedHashMap<Integer, String> _deleted = new LinkedHashMap<>();
}

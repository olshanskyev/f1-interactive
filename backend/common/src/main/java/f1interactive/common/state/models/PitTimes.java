package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import f1interactive.common.state.models.deserializer.PitTimesDeserializer;

import java.util.ArrayList;
import java.util.LinkedHashMap;

@JsonDeserialize(using = PitTimesDeserializer.class)
public class PitTimes{
    @JsonProperty("Lines")
    public LinkedHashMap<String, PitTimesItem> lines = new LinkedHashMap<>();
    public ArrayList<String> _deleted;
}

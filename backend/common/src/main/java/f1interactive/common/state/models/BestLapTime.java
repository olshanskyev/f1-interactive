package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import f1interactive.common.state.models.deserializer.ArrayWrapperDeserializer;
import f1interactive.common.state.models.deserializer.ArrayWrapperSerializer;
import tools.jackson.databind.annotation.JsonDeserialize;
import tools.jackson.databind.annotation.JsonSerialize;

public class BestLapTime{
    @JsonProperty("Value")
    public String value;
    @JsonProperty("Lap") 
    public Integer lap;

    @JsonProperty("_deleted")
    @JsonDeserialize(using = ArrayWrapperDeserializer.class)
    @JsonSerialize(using = ArrayWrapperSerializer.class)
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    public ArrayWrapper<Integer, String> _deleted = new ArrayWrapper<>();
}

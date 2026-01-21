package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import f1interactive.common.state.models.deserializer.DriverListSanitizer;
import f1interactive.common.state.models.merge.Merger;

import java.util.LinkedHashMap;

@JsonDeserialize(converter = DriverListSanitizer.class)
public class DriverList implements UpdateEvent{
    @JsonProperty("Lines")
    public LinkedHashMap<String, DriverListItem> lines = new LinkedHashMap<>();

    @Override
    public Root merge(Root state) {
        if (state.driverList == null)
            state.driverList = new DriverList();
        Merger.mergeAllNotNull(state.driverList, this);
        return state;
    }
}

package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import f1interactive.common.state.models.deserializer.DriverListSanitizer;
import f1interactive.common.state.models.merge.Merger;
import tools.jackson.databind.annotation.JsonDeserialize;

import java.util.LinkedHashMap;

@JsonDeserialize(converter = DriverListSanitizer.class)
public class DriverList implements UpdateEvent{
    @JsonProperty("Lines")
    public LinkedHashMap<String, DriverListItem> lines;

    @Override
    public Root merge(Root state) {
        if (state.driverList == null)
            state.driverList = new DriverList();
        Merger.mergeAllNotNull(state.driverList, this);
        return state;
    }
}

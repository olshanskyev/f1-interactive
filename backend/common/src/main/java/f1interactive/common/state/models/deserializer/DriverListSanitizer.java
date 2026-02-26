package f1interactive.common.state.models.deserializer;


import f1interactive.common.state.models.DriverList;
import f1interactive.common.state.models.DriverListItem;
import tools.jackson.databind.util.StdConverter;

import java.util.LinkedHashMap;

// sanitizer for removing last _kf if exists and building new class
public class DriverListSanitizer extends StdConverter<LinkedHashMap<String, DriverListItem>, DriverList> {

    @Override
    public DriverList convert(LinkedHashMap<String, DriverListItem> inputMap) {
        inputMap.remove("_kf");
        DriverList driverList = new DriverList();
        driverList.lines = inputMap;
        return driverList;
    }
}

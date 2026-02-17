package f1interactive.common.state.models.deserializer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import f1interactive.common.state.models.CarDataZ;
import f1interactive.common.state.models.PositionZ;
import f1interactive.common.state.models.Root;
import f1interactive.common.state.models.UpdateEvent;

public class EventsParser {

    public record UpdateEventRecord(String className, UpdateEvent updateEvent, String utc) {
    }
    /**
     *
     * @param updateEvent comma separated eventName,{event as json},utcTimestamp
     * @return UpdateEventRecord
     */
    public static UpdateEventRecord parseUpdateEvent(String updateEvent) {
        int firstCommaPos = updateEvent.indexOf(",");
        int lastCommaPos = updateEvent.lastIndexOf(",");
        if (firstCommaPos == -1 || lastCommaPos == -1 || lastCommaPos == firstCommaPos) {
            throw new RuntimeException("Unexpected update event format");
        }
        String className = updateEvent.substring(0, firstCommaPos);
        String objectString = updateEvent.substring(firstCommaPos + 1, lastCommaPos);
        String utcString = updateEvent.substring(lastCommaPos + 1);
        return new UpdateEventRecord(className, parseUpdateEvent(className, objectString), utcString);

    }

    public static UpdateEvent parseUpdateEvent(String eventClassName, String payload) {
        try {
            if (eventClassName.equals("CarData.z")) //workaround because of not possible class name
                return new CarDataZ(payload);
            if (eventClassName.equals("Position.z"))
                return new PositionZ(payload);
            Class<?> clazz = Class.forName("f1interactive.common.state.models." + eventClassName);
            ObjectMapper objectMapper = new ObjectMapper();
            return (UpdateEvent) objectMapper.readValue(payload, clazz);
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("Class not defined: " + e.getMessage());
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Update event deserialization error: " + e.getMessage());
        }
    }

    public static Root parseInitEvent(String initEvent) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(initEvent, Root.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Init event deserialization error: " + e.getMessage());
        }
    }
}

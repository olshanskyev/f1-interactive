package f1interactive.common.state.models.deserializer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import f1interactive.common.state.models.Root;
import f1interactive.common.state.models.UpdateEvent;

public class EventsParser {
    /**
     *
     * @param updateEvent comma separated eventName,{event as json},utcTimestamp
     * @return UpdateEvent
     */
    public static UpdateEvent parseUpdateEvent(String updateEvent) {
        int firstCommaPos = updateEvent.indexOf(",");
        int lastCommaPos = updateEvent.lastIndexOf(",");
        if (firstCommaPos == -1 || lastCommaPos == -1 || lastCommaPos == firstCommaPos) {
            throw new RuntimeException("Unexpected update event format");
        }
        String className = updateEvent.substring(0, firstCommaPos);
        String objectString = updateEvent.substring(firstCommaPos + 1, lastCommaPos);
        return parseUpdateEvent(className, objectString);

    }

    public static UpdateEvent parseUpdateEvent(String eventClassName, String payload) {
        try {
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

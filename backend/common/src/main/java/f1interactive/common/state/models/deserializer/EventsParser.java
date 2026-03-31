package f1interactive.common.state.models.deserializer;


import f1interactive.common.state.models.CarDataZ;
import f1interactive.common.state.models.PositionZ;
import f1interactive.common.state.models.Root;
import f1interactive.common.state.models.UpdateEvent;
import tools.jackson.databind.ObjectMapper;

public class EventsParser {

    public record UpdateEventRecord(String className, UpdateEvent updateEvent, long utc) {
    }

    record EventFromString(String className, String event, String utc) {}

    private static EventFromString parseEventString(String event) {
        int firstCommaPos = event.indexOf(",");
        int lastCommaPos = event.lastIndexOf(",");
        if (firstCommaPos == -1 || lastCommaPos == -1 || lastCommaPos == firstCommaPos) {
            throw new RuntimeException("Unexpected update event format");
        }
        return new EventFromString(
                event.substring(0, firstCommaPos),
                event.substring(firstCommaPos + 1, lastCommaPos),
                event.substring(lastCommaPos + 1));
    }
    /**
     *
     * @param updateEvent comma separated eventName,{event as json},utcTimestamp
     * @return UpdateEventRecord with currentTimeMillis (not from event)
     */
    public static UpdateEventRecord parseUpdateEvent(String updateEvent) {
        EventFromString eventRecord = parseEventString(updateEvent);
        return new UpdateEventRecord(eventRecord.className, parseUpdateEvent(eventRecord.className, eventRecord.event), System.currentTimeMillis());
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
        }
    }

    /**
     *
     * @param rootJsonString root as json string
     * @return
     */
    public static Root parseRoot(String rootJsonString) {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(rootJsonString, Root.class);

    }

    /**
     * @param initEvent comma separated event Root, {}, utc
     * @return
     */
    public static Root parseInitEvent(String initEvent) {
        EventFromString eventRecord = parseEventString(initEvent);
        if (!eventRecord.className.equals("Root"))
            throw new RuntimeException("Unexpected class, expected Root");
        return parseRoot(eventRecord.event);
    }
}

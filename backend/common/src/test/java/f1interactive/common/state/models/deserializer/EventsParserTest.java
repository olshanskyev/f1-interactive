package f1interactive.common.state.models.deserializer;


import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class EventsParserTest {

    @Test
    public void parseUpdateEventsTest() {
        String testUpdateEvent = "TimingStats,{\"Lines\":{\"1\":{\"BestSectors\":{\"1\":{\"Position\":2}}},\"4\":{\"BestSectors\":{\"1\":{\"Position\":3}}},\"81\":{\"BestSectors\":{\"1\":{\"Position\":1,\"Value\":\"38.376\"}}}}},2025-12-07T13:04:27.871Z";
        EventsParser.UpdateEventRecord updateEventRecord = EventsParser.parseUpdateEvent(testUpdateEvent);
        assertEquals("TimingStats", updateEventRecord.className());
        assertNotNull(updateEventRecord.updateEvent());
        assertEquals("2025-12-07T13:04:27.871Z", updateEventRecord.utc());
    }
}

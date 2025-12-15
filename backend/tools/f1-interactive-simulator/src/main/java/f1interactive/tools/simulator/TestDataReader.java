package f1interactive.tools.simulator;

import java.time.Instant;

public class TestDataReader {

    private static long getMillisFromInitState(String initState) {
        String prefix = "ExtrapolatedClock\":{\"Utc\":\"";
        int utcStart = initState.indexOf(prefix) + prefix.length();
        int utcEnd = initState.indexOf("\"", utcStart);
        String utc = initState.substring(utcStart, utcEnd);
        Instant parse = Instant.parse(utc);
        return parse.toEpochMilli();
    }

    private static long getMillisFromUpdateEvent(String updateEvent) {
        String utc = updateEvent.substring(updateEvent.lastIndexOf(",") + 1);
        Instant parse = Instant.parse(utc);
        return parse.toEpochMilli();
    }

    public static long getMillisFromEvent(String event) {
        return (event.startsWith("{"))? getMillisFromInitState(event): getMillisFromUpdateEvent(event);
    }
}

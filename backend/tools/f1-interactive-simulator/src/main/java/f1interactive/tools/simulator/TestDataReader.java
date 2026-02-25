package f1interactive.tools.simulator;

import java.time.Instant;

public class TestDataReader {

    public static long getMillisFromEvent(String event) {
        String utc = event.substring(event.lastIndexOf(",") + 1);
        Instant parse = Instant.parse(utc);
        return parse.toEpochMilli();
    }

    public static boolean isFullStateEvent(String event) {
        return event.startsWith("Root");
    }
}

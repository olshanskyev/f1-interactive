package f1interactive.tools.simulator;


import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;


import java.time.Instant;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class TestDataReaderTest {

    @ParameterizedTest
    @MethodSource("sourceUTCParsing")
    public void parsingUTCTest(String event, String expectedUtc) {
        assertEquals(Instant.parse(expectedUtc).toEpochMilli(), TestDataReader.getMillisFromEvent(event));
    }

    private static Stream<Arguments> sourceUTCParsing() {
        return Stream.of(
                Arguments.of("Root,{\"Heartbeat\":{\"Utc\":\"2025-12-05T09:28:46.9137314Z\",\"_kf\":true},\"ExtrapolatedClock\":{\"Utc\":\"2025-12-05T09:28:49.4382038Z\",2025-12-05T09:28:49.4382038Z", "2025-12-05T09:28:49.4382038Z"),
                Arguments.of("WeatherData,{\"AirTemp\":\"27.6\",\"Humidity\":\"44.0\",\"Pressure\":\"1017.0\",\"Rainfall\":\"0\",\"TrackTemp\":\"35.0\",\"WindDirection\":\"148\",\"WindSpeed\":\"1.4\",\"_kf\":true},2025-12-05T09:28:55.219Z", "2025-12-05T09:28:55.219Z"),
                Arguments.of("Heartbeat,{\"Utc\":\"2025-12-05T09:29:01.9197037Z\",\"_kf\":true},2025-12-05T09:28:59.7509889Z", "2025-12-05T09:28:59.7509889Z")
        );
    }
}

package f1interactive.tools.simulator;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InOrder;
import org.mockito.Mockito;
import static org.mockito.Mockito.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;

public class SimulatorTest {

    interface PublishInterface {
        void publishInit(String message);
        void publishUpdate(int eventNumber, String message);
        void endOfEvents();
    }

    @ParameterizedTest
    @MethodSource("savedSessionsSourceNumberOfEvent")
    public void initTest(String source, int expectedNumberOfEvents) throws IOException {
        Simulator simulator = Simulator.init(source);
        assertEquals(expectedNumberOfEvents, simulator.getNumberOfEvents());

    }

    private static Stream<Arguments> savedSessionsSourceNumberOfEvent() {
        return Stream.of(
                Arguments.of("src/test/resources/saved_sessions/2025/2025_abu_dhabi_qualification_data.txt", 11299),
                Arguments.of("src/test/resources/saved_sessions/2025/2025_abu_dhabi_practice1_data.txt", 18237),
                Arguments.of("src/test/resources/saved_sessions/2025/2025_abu_dhabi_race_data.txt", 67793)
        );
    }

    @Test
    public void simulatorOperationTest() throws IOException, InterruptedException {
        String source = "src/test/resources/saved_sessions/2025/2025_abu_dhabi_practice2_data.txt";
        String wrongSource = "src/test/resources/saved_sessions/2025/2025_abu_dhabi_practice_data.txt";
        assertThrows(IOException.class, () -> Simulator.init(wrongSource));
        Simulator simulator = Simulator.init(source);
        simulator.start();
        assertEquals(SimulatorState.STARTED, simulator.getState());
        simulator.pause();
        simulator.pause();
        assertEquals(SimulatorState.PAUSED, simulator.getState());
        simulator.stop();
        assertEquals(SimulatorState.STOPPED, simulator.getState());
        simulator.stop();
        assertEquals(SimulatorState.STOPPED, simulator.getState());

        float playbackRatio = 1.1F;
        simulator.setPlaybackSpeedRatio(playbackRatio);
        assertEquals(playbackRatio,simulator.getPlaybackSpeedRatio());
        assertThrows(IllegalArgumentException.class, () -> simulator.setPlaybackSpeedRatio(-1.0F));
    }

    @Test
    public void callBackendTest() throws IOException, InterruptedException {
        String path = "src/test/resources/saved_sessions/2025/partly_data.txt";
        Simulator simulator = Simulator.init(path);
        List<String> events = Files.readAllLines(Paths.get(path));

        PublishInterface serviceMock = Mockito.mock(PublishInterface.class);
        simulator.onInitEvent(serviceMock::publishInit);
        simulator.onUpdateEvent(serviceMock::publishUpdate);
        simulator.onEndOfEvents(serviceMock::endOfEvents);

        simulator.setPlaybackSpeedRatio(100L); // less than 1 second for reading
        simulator.start();
        simulator.pause();
        simulator.start();
        Thread.sleep(10);
        simulator.setPlaybackSpeedRatio(150L);
        Thread.sleep(1000);

        assertEquals(SimulatorState.STOPPED, simulator.getState());

        verify(serviceMock, times(1)).publishInit(anyString());
        verify(serviceMock, times(12)).publishUpdate(anyInt(), anyString());
        verify(serviceMock, times(1)).endOfEvents();

        // checking calling order
        InOrder inOrder = inOrder(serviceMock);
        inOrder.verify(serviceMock).publishInit(events.get(0));
        for(int it = 1; it < events.size(); it++) {
            inOrder.verify(serviceMock).publishUpdate(it, events.get(it));
        }
        inOrder.verify(serviceMock).endOfEvents();

    }
}

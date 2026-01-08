package f1interactive.common.state.models;

import com.fasterxml.jackson.databind.ObjectMapper;
import f1interactive.common.state.models.deserializer.EventsParser;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.IOException;
import java.util.Scanner;

import static org.junit.jupiter.api.Assertions.*;

public class ModelsDeserializationTest {

    @Test
    public void heartbeatTest() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        Root root = objectMapper.readValue(new File("src\\test\\resources\\modelsTestData\\heartbeat.json"), Root.class);
        assertTrue(root.heartbeat._kf);
        assertNotNull(root.heartbeat.utc);
        assertNull(root.extrapolatedClock);
    }

    @Test
    public void extrapolatedClockTest() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        Root root = objectMapper.readValue(new File("src\\test\\resources\\modelsTestData\\extrapolatedClock.json"), Root.class);
        assertTrue(root.extrapolatedClock.extrapolating);
        assertNotNull(root.extrapolatedClock.utc);
        assertEquals("00:25:45", root.extrapolatedClock.remaining);
    }

    @Test
    public void topThreeTest() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        Root root = objectMapper.readValue(new File("src\\test\\resources\\modelsTestData\\topThree.json"), Root.class);
        assertFalse(root.topThree.withheld);
        assertEquals(3, root.topThree.lines.size());
        assertEquals("MAXVER01", root.topThree.lines.get(0).reference);
    }

    @Test
    public void timingStatsTest() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        Root root = objectMapper.readValue(new File("src\\test\\resources\\modelsTestData\\timingStats.json"), Root.class);
        assertNotNull(root.timingStats.lines);
        assertEquals(20, root.timingStats.lines.size());
        root.timingStats.lines.forEach((s, item) -> {
            assertTrue(Integer.parseInt(item.racingNumber) > 0);
            assertNotNull(item.personalBestLapTime);
            assertNotNull(item.bestSectors);
            assertNotNull(item.bestSpeeds);
            assertEquals(3, item.bestSectors.size());
            assertEquals(4, item.bestSpeeds.size());
        });

        TimingStatsLinesItem timingStatsLinesItem = root.timingStats.lines.get("63");
        assertEquals(57, timingStatsLinesItem.personalBestLapTime.lap);
        assertEquals(12, timingStatsLinesItem.bestSectors.get(0).position);
        assertEquals(336, Integer.parseInt(timingStatsLinesItem.bestSpeeds.get("ST").value));

    }

    @Test
    public void timingAppDataTest() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        Root root = objectMapper.readValue(new File("src\\test\\resources\\modelsTestData\\timingAppData.json"), Root.class);
        assertNotNull(root.timingAppData.lines);
        assertEquals(20, root.timingAppData.lines.size());

        root.timingAppData.lines.forEach((s, item) -> {
            assertTrue(Integer.parseInt(item.racingNumber) > 0);
            assertTrue(Integer.parseInt(item.gridPos) > 0);
            assertFalse(item.stints.isEmpty());

        });

        TimingAppDataLinesItem timingAppDataLinesItem = root.timingAppData.lines.get("4");
        assertEquals(2, Integer.parseInt(timingAppDataLinesItem.gridPos));
        assertEquals(3, timingAppDataLinesItem.stints.size());
        assertEquals("MEDIUM", timingAppDataLinesItem.stints.get(0).compound);
        assertEquals(16, timingAppDataLinesItem.stints.get(0).totalLaps);
    }

    @Test
    public void weatherDataTest() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        Root root = objectMapper.readValue(new File("src\\test\\resources\\modelsTestData\\weatherData.json"), Root.class);
        assertNotNull(root.weatherData);
        assertEquals("25.9", root.weatherData.airTemp);
        assertEquals("101", root.weatherData.windDirection);
    }

    @Test
    public void trackStatusTest() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        Root root = objectMapper.readValue(new File("src\\test\\resources\\modelsTestData\\trackStatus.json"), Root.class);
        assertNotNull(root.trackStatus);
        assertEquals("1", root.trackStatus.status);
        assertEquals("AllClear", root.trackStatus.message);
    }


    @Test
    public void driverListTest() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        Root root = objectMapper.readValue(new File("src\\test\\resources\\modelsTestData\\driverList.json"), Root.class);
        Root rootWithKf = objectMapper.readValue(new File("src\\test\\resources\\modelsTestData\\driverList_with_kf.json"), Root.class);
        assertNotNull(root.driverList);
        assertEquals(20, root.driverList.lines.size());
        assertFalse(root.driverList.lines.containsKey("_kf"));
        assertNotNull(rootWithKf.driverList.lines);
        assertEquals(20, rootWithKf.driverList.lines.size());
        assertFalse(rootWithKf.driverList.lines.containsKey("_kf"));
        root.driverList.lines.forEach((s, driverListItem) -> {
            assertTrue(Integer.parseInt(driverListItem.racingNumber) > 0);
            assertFalse(driverListItem.teamName.isEmpty());
        });
        rootWithKf.driverList.lines.forEach((s, driverListItem) -> {
            assertTrue(Integer.parseInt(driverListItem.racingNumber) > 0);
            assertFalse(driverListItem.teamName.isEmpty());
        });
        DriverListItem driverListItem = root.driverList.lines.get("6");
        assertNotNull(driverListItem);
        assertEquals("HAD", driverListItem.tla);

    }

    @Test
    public void raceControlMessagesTest() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        Root root = objectMapper.readValue(new File("src\\test\\resources\\modelsTestData\\raceControlMessages.json"), Root.class);
        assertNotNull(root.raceControlMessages);
        assertEquals(107, root.raceControlMessages.messages.size());
        Message firstMessage = root.raceControlMessages.messages.get(0);
        Message secondMessage = root.raceControlMessages.messages.get(1);
        Message lastMessage = root.raceControlMessages.messages.get(106);
        assertEquals("Flag", firstMessage.category);
        assertEquals("Other", lastMessage.category);
        assertTrue(lastMessage.utc.after(firstMessage.utc));
        assertTrue(firstMessage.utc.before(secondMessage.utc));
        assertEquals("VIRTUAL SAFETY CAR", secondMessage.mode);
        assertEquals("DEPLOYED", secondMessage.status);
    }

    @Test
    public void sessionInfoTest() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        Root root = objectMapper.readValue(new File("src\\test\\resources\\modelsTestData\\sessionInfo.json"), Root.class);
        assertNotNull(root.sessionInfo);
        assertEquals("UAE", root.sessionInfo.meeting.country.code);
        assertEquals("Yas Marina Circuit", root.sessionInfo.meeting.circuit.shortName);
        assertEquals(9839, root.sessionInfo.key);
        assertEquals(1, root.sessionInfo.number);
    }

    @Test
    public void sessionDataTest() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        Root root = objectMapper.readValue(new File("src\\test\\resources\\modelsTestData\\sessionData.json"), Root.class);
        assertNotNull(root.sessionData);
        assertEquals(58, root.sessionData.series.size());
        assertEquals(9, root.sessionData.statusSeries.size());
        for (int i = 0; i < root.sessionData.series.size(); i++) {
            assertEquals(i+1, root.sessionData.series.get(i).lap);
        }
        assertEquals("Yellow", root.sessionData.statusSeries.get(1).trackStatus);
    }

    @Test
    public void sessionStatusTest() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        Root root = objectMapper.readValue(new File("src\\test\\resources\\modelsTestData\\sessionStatus.json"), Root.class);
        assertNotNull(root.sessionStatus);
        assertEquals("Finished", root.sessionStatus.started);
    }

    @Test
    public void lapCountTest() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        Root root = objectMapper.readValue(new File("src\\test\\resources\\modelsTestData\\lapCount.json"), Root.class);
        assertNotNull(root.lapCount);
        assertEquals(58, root.lapCount.currentLap);
        assertEquals(58, root.lapCount.totalLaps);
    }

    @Test
    public void timingDataTest() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        Root root = objectMapper.readValue(new File("src\\test\\resources\\modelsTestData\\timingData.json"), Root.class);
        assertNotNull(root.timingData);
        assertEquals(20, root.timingData.lines.size());
        TimingDataLinesItem timingDataLinesItem = root.timingData.lines.get("30");
        assertEquals(57, timingDataLinesItem.numberOfLaps);
        assertEquals(1, timingDataLinesItem.numberOfPitStops);
        assertEquals(3, timingDataLinesItem.sectors.size());
        assertEquals("32.625", timingDataLinesItem.sectors.get(2).value);
        assertEquals(10, timingDataLinesItem.sectors.get(2).segments.size());
        assertEquals(213, Integer.parseInt(timingDataLinesItem.speeds.get("FL").value));
        assertEquals("1:29.022", timingDataLinesItem.lastLapTime.value);
        assertEquals("timeDiffToFastestValue", timingDataLinesItem.timeDiffToFastest);
        assertEquals("TimeDiffToPositionAheadValue", timingDataLinesItem.timeDiffToPositionAhead);
    }

    @Test
    public void teamRadioTest() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        Root root = objectMapper.readValue(new File("src\\test\\resources\\modelsTestData\\teamRadio.json"), Root.class);
        assertNotNull(root.teamRadio);
        assertEquals(22, root.teamRadio.captures.size());
        assertEquals("TeamRadio/LANNOR01_4_20251207_170931.mp3", root.teamRadio.captures.get(2).path);
    }

    @Test
    public void pitLaneTimeCollectionTest() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        Root root = objectMapper.readValue(new File("src\\test\\resources\\modelsTestData\\pitLaneTimeCollection.json"), Root.class);
        assertNotNull(root.pitLaneTimeCollection.pitTimes);
    }

    @Test
    public void pitTimesTest() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        PitLaneTimeCollection pitLaneCollectionDeleted = objectMapper.readValue(new File("src\\test\\resources\\modelsTestData\\PitTimes_deleted.json"), PitLaneTimeCollection.class);
        assertNotNull(pitLaneCollectionDeleted);
        assertEquals(1, pitLaneCollectionDeleted.pitTimes._deleted.size());
        assertEquals(27, Integer.parseInt(pitLaneCollectionDeleted.pitTimes._deleted.get(0)));

        PitLaneTimeCollection pitLaneCollection = objectMapper.readValue(new File("src\\test\\resources\\modelsTestData\\PitTimes.json"), PitLaneTimeCollection.class);
        assertEquals("21.6", pitLaneCollection.pitTimes.lines.get("27").duration);
        assertNull(pitLaneCollection.pitTimes.lines.get("_kf"));
    }

    @Test
    public void readingInitialStatesTest() throws IOException {
        try (Scanner scanner = new Scanner(new File("src\\test\\resources\\modelsTestData\\initStatesCollection.txt"))) {
            while (scanner.hasNextLine()) {
                String state = scanner.nextLine();
                ObjectMapper objectMapper = new ObjectMapper();
                Root root = objectMapper.readValue(state, Root.class);
                assertNotNull(root);
            }
        }

    }

    @Test
    @Disabled // high load
    public void readingUpdateEventsTest() throws IOException {
        try (Scanner scanner = new Scanner(new File("src\\test\\resources\\modelsTestData\\2025_abu_dhabi_race_only_update_events.txt"))) {
            while (scanner.hasNextLine()) {
                String event = scanner.nextLine();
                UpdateEvent updateEvent = EventsParser.parseUpdateEvent(event).updateEvent();
                assertNotNull(updateEvent);
            }
        }
    }



}

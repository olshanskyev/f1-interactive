package f1interactive.common.state.models.merge;

import f1interactive.common.state.models.Root;
import f1interactive.common.state.models.UpdateEvent;
import f1interactive.common.state.models.deserializer.EventsParser;
import org.junit.jupiter.api.Test;
import tools.jackson.databind.ObjectMapper;

import java.io.File;
import java.io.IOException;
import java.util.Scanner;

import static org.junit.jupiter.api.Assertions.*;

public class MergingEventsTest {

    @Test
    public void mergeTimingAppDataTest() throws IOException {

        ObjectMapper objectMapper = new ObjectMapper();
        Root root = objectMapper.readValue(new File("src\\test\\resources\\mergingTestData\\timingAppDataInitState.json"), Root.class);
        try (Scanner updateScanner = new Scanner(new File("src\\test\\resources\\mergingTestData\\timingAppDataUpdateEvents.txt"))) {
            while (updateScanner.hasNextLine()) {
                String updateEventString = updateScanner.nextLine();
                UpdateEvent updateEvent = EventsParser.parseUpdateEvent(updateEventString).updateEvent();
                root = updateEvent.merge(root);
            }
        }
        assertEquals(20, root.timingAppData.lines.size());

        root.timingAppData.lines.forEach((driverId, dataByDriver) -> {
            assertEquals(dataByDriver.racingNumber, driverId);
            assertTrue(dataByDriver.line >=1 && dataByDriver.line <= 20);
            assertTrue(Integer.parseInt(dataByDriver.gridPos) >=1 && Integer.parseInt(dataByDriver.gridPos) <= 20);
            if (!driverId.equals("4")) {
                assertEquals(1, dataByDriver.stints.values.size());
                assertTrue(
                        dataByDriver.stints.values.get(0).compound.equals("MEDIUM") ||
                                dataByDriver.stints.values.get(0).compound.equals("HARD") ||
                                dataByDriver.stints.values.get(0).compound.equals("SOFT")
                        );
                if (Boolean.parseBoolean(dataByDriver.stints.values.get(0).isNew)) {
                    assertEquals(0, dataByDriver.stints.values.get(0).totalLaps);
                    assertEquals(0, dataByDriver.stints.values.get(0).startLaps);
                } else {
                    assertTrue(dataByDriver.stints.values.get(0).totalLaps > 0 &&
                            dataByDriver.stints.values.get(0).startLaps > 0);
                }

            } else {
                assertEquals(2, dataByDriver.stints.values.size());
                assertEquals("1:29.528", dataByDriver.stints.values.get(1).lapTime);
                assertEquals(20, dataByDriver.stints.values.get(1).lapNumber);
            }
        });
        assertEquals(5, root.timingAppData.lines.get("31").line);
    }


    @Test
    public void mergeDriverListTest() throws IOException {

        ObjectMapper objectMapper = new ObjectMapper();
        Root root = objectMapper.readValue(new File("src\\test\\resources\\mergingTestData\\driverListInitState.json"), Root.class);
        try (Scanner updateScanner = new Scanner(new File("src\\test\\resources\\mergingTestData\\driverListUpdateEvents.txt"))) {
            while (updateScanner.hasNextLine()) {
                String updateEventString = updateScanner.nextLine();
                UpdateEvent updateEvent = EventsParser.parseUpdateEvent(updateEventString).updateEvent();
                root = updateEvent.merge(root);
            }
        }
        assertEquals(20, root.driverList.lines.size());
        root.driverList.lines.forEach((driverId, dataByDriver) -> {
            assertTrue(dataByDriver.line >=1 && dataByDriver.line <= 20);

        });
        assertEquals(4, root.driverList.lines.get("16").line);
        assertEquals(6, root.driverList.lines.get("63").line);
        assertEquals(5, root.driverList.lines.get("14").line);
        assertEquals(9, root.driverList.lines.get("31").line);
        assertEquals(8, root.driverList.lines.get("6").line);
    }


    @Test
    public void mergeTopThreeTest() throws IOException {

        ObjectMapper objectMapper = new ObjectMapper();
        Root root = objectMapper.readValue(new File("src\\test\\resources\\mergingTestData\\topThreeInitState.json"), Root.class);
        assertFalse(root.topThree.withheld);
        try (Scanner updateScanner = new Scanner(new File("src\\test\\resources\\mergingTestData\\topThreeUpdateEvents.txt"))) {
            while (updateScanner.hasNextLine()) {
                String updateEventString = updateScanner.nextLine();
                UpdateEvent updateEvent = EventsParser.parseUpdateEvent(updateEventString).updateEvent();
                root = updateEvent.merge(root);
            }
        }
        assertEquals(3, root.topThree.lines.values.size());
        assertEquals(67, root.topThree.lines.values.get(0).lapState);
        assertTrue(root.topThree.lines.values.get(0).overallFastest);
        assertTrue(root.topThree.lines.values.get(0).personalFastest);
        assertEquals("LAP 2", root.topThree.lines.values.get(0).diffToLeader);
        assertEquals("1:29.117", root.topThree.lines.values.get(0).lapTime);
        assertEquals("+0.120", root.topThree.lines.values.get(1).diffToLeader);
        assertEquals("+0.312", root.topThree.lines.values.get(2).diffToLeader);
        assertEquals("+0.192", root.topThree.lines.values.get(2).diffToAhead);
        try (Scanner updateScanner = new Scanner(new File("src\\test\\resources\\mergingTestData\\topThreeUpdateEventSwapPosition.txt"))) {
            while (updateScanner.hasNextLine()) {
                String updateEventString = updateScanner.nextLine();
                UpdateEvent updateEvent = EventsParser.parseUpdateEvent(updateEventString).updateEvent();
                root = updateEvent.merge(root);
            }
        }

        assertEquals("81", root.topThree.lines.values.get(0).racingNumber);
        assertEquals("1", root.topThree.lines.values.get(1).racingNumber);
        assertEquals("1:29.515", root.topThree.lines.values.get(0).lapTime);
        assertEquals("McLaren", root.topThree.lines.values.get(0).team);
        assertEquals("1:31.365", root.topThree.lines.values.get(1).lapTime);
        assertEquals("Red Bull Racing", root.topThree.lines.values.get(1).team);

    }


    @Test
    public void mergeTimingStatsTest() throws IOException {

        ObjectMapper objectMapper = new ObjectMapper();
        Root root = objectMapper.readValue(new File("src\\test\\resources\\mergingTestData\\timingStatsInitState.json"), Root.class);
        assertFalse(root.timingStats.withheld);
        assertEquals("Race", root.timingStats.sessionType);
        try (Scanner updateScanner = new Scanner(new File("src\\test\\resources\\mergingTestData\\timingStatsUpdateEvents.txt"))) {
            while (updateScanner.hasNextLine()) {
                String updateEventString = updateScanner.nextLine();
                UpdateEvent updateEvent = EventsParser.parseUpdateEvent(updateEventString).updateEvent();
                root = updateEvent.merge(root);
            }
        }

        assertEquals(20, root.timingStats.lines.size());
        assertEquals(7, root.timingStats.lines.get("1").bestSpeeds.get("I1").position);
        assertEquals("284", root.timingStats.lines.get("1").bestSpeeds.get("I1").value);
        assertEquals(5, root.timingStats.lines.get("1").bestSpeeds.get("FL").position);
        assertEquals("213", root.timingStats.lines.get("1").bestSpeeds.get("FL").value);

        assertEquals(1, root.timingStats.lines.get("63").bestSpeeds.get("FL").position);
        assertEquals("214", root.timingStats.lines.get("63").bestSpeeds.get("FL").value);

        assertEquals(2, root.timingStats.lines.get("1").bestSectors.values.get(1).position);
        assertEquals(1, root.timingStats.lines.get("81").bestSectors.values.get(1).position);
        assertEquals("38.376", root.timingStats.lines.get("81").bestSectors.values.get(1).value);
        assertEquals(1, root.timingStats.lines.get("1").bestSectors.values.get(2).position);
        assertEquals("32.363", root.timingStats.lines.get("1").bestSectors.values.get(2).value);

    }

    @Test
    public void mergeTimingDataTest() throws IOException {

        ObjectMapper objectMapper = new ObjectMapper();
        Root root = objectMapper.readValue(new File("src\\test\\resources\\mergingTestData\\timingDataInitState.json"), Root.class);
        assertFalse(root.timingData.withheld);
        try (Scanner updateScanner = new Scanner(new File("src\\test\\resources\\mergingTestData\\timingDataUpdateEvents.txt"))) {
            while (updateScanner.hasNextLine()) {
                String updateEventString = updateScanner.nextLine();
                UpdateEvent updateEvent = EventsParser.parseUpdateEvent(updateEventString).updateEvent();
                root = updateEvent.merge(root);
            }
        }

        assertEquals(20, root.timingData.lines.size());
        assertEquals(3, root.timingData.lines.get("1").sectors.values.size());
        assertEquals(0, root.timingData.lines.get("1").sectors.values.get(1).status);
        assertEquals(2049, root.timingData.lines.get("1").sectors.values.get(2).segments.values.get(2).status);
        assertEquals(2051, root.timingData.lines.get("1").sectors.values.get(2).segments.values.get(3).status);
        assertEquals(0, root.timingData.lines.get("1").sectors.values.get(1).segments.values.get(2).status);
        assertEquals("+0.534", root.timingData.lines.get("81").gapToLeader);
        assertEquals("+0.534", root.timingData.lines.get("81").intervalToPositionAhead.value);

        assertEquals(0, root.timingData.lines.get("4").sectors.values.get(1).segments.values.get(4).status);
        assertEquals(2048, root.timingData.lines.get("44").sectors.values.get(1).segments.values.get(4).status);
        assertEquals(3, root.timingData.lines.get("44").sectors.values.size());
        assertEquals(9, root.timingData.lines.get("44").sectors.values.get(1).segments.values.size());
    }

    @Test
    public void mergeContentStreamsTest() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        Root root = objectMapper.readValue(new File("src\\test\\resources\\mergingTestData\\contentStreamsInitState.json"), Root.class);
        try (Scanner updateScanner = new Scanner(new File("src\\test\\resources\\mergingTestData\\contentStreamsUpdateEvents.txt"))) {
            while (updateScanner.hasNextLine()) {
                String updateEventString = updateScanner.nextLine();
                UpdateEvent updateEvent = EventsParser.parseUpdateEvent(updateEventString).updateEvent();
                root = updateEvent.merge(root);
            }
        }

        assertEquals(2, root.contentStreams.streams.values.size());
        assertEquals("new_uri", root.contentStreams.streams.values.get(0).uri);
        assertEquals("new_name", root.contentStreams.streams.values.get(1).name);
    }

    @Test
    public void mergeDataZTest() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        Root root = objectMapper.readValue(new File("src\\test\\resources\\mergingTestData\\dataZInitState.json"), Root.class);
        assertEquals("CarValue1", root.carDataZ.getValue());
        assertEquals("PositionValue1", root.positionZ.getValue());
        try (Scanner updateScanner = new Scanner(new File("src\\test\\resources\\mergingTestData\\dataZUpdateEvents.txt"))) {
            while (updateScanner.hasNextLine()) {
                String updateEventString = updateScanner.nextLine();
                UpdateEvent updateEvent = EventsParser.parseUpdateEvent(updateEventString).updateEvent();
                root = updateEvent.merge(root);
            }
        }

        assertEquals("CarDataLastValue", root.carDataZ.getValue());
        assertEquals("PositionLastValue", root.positionZ.getValue());
    }

}

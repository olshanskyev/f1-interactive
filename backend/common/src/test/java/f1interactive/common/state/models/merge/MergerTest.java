package f1interactive.common.state.models.merge;

import f1interactive.common.state.models.*;
import org.junit.jupiter.api.Test;

import java.util.LinkedHashMap;

import static org.junit.jupiter.api.Assertions.*;

public class MergerTest {

    @Test
    public void mergeAllPrimitiveNotNull() {
        Stint update = new Stint();
        update.lapTime = "1:20:37.125";
        update.compound = "MEDIUM";
        Stint to = new Stint();
        to.totalLaps = 4;
        Merger.mergeAllNotNull(to, update);
        assertEquals(update.lapTime, to.lapTime);
        assertEquals(update.compound, to.compound);
        assertEquals(4, to.totalLaps);
        assertNull(to.lapFlags);
    }

    @Test
    public void mergeAllNotNullFieldsTest() {
        TimingData fromTimingData = new TimingData();
        fromTimingData.withheld = false;
        TimingDataLinesItem item1 = new TimingDataLinesItem();
        TimingDataLinesItem item2 = new TimingDataLinesItem();
        SpeedsItem item1Speed1 = new SpeedsItem();
        item1Speed1.value = "240";
        item1Speed1.overallFastest = true;
        SpeedsItem item1Speed2 = new SpeedsItem();
        item1Speed2.value = "230";
        item1Speed2.position = 2;
        item1.speeds = new LinkedHashMap<>();
        item1.speeds.put("S1", item1Speed1);
        item1.speeds.put("S2", item1Speed2);
        item2.speeds = new LinkedHashMap<>();
        SpeedsItem item2Speed1 = new SpeedsItem();
        item2Speed1.value = "241";
        item2Speed1.overallFastest = true;
        item2.speeds.put("S1", item2Speed1);
        fromTimingData.lines = new LinkedHashMap<>();
        fromTimingData.lines.put("1", item1);
        fromTimingData.lines.put("2", item2);
        fromTimingData.noEntries = new ArrayWrapper<>();
        fromTimingData.noEntries.values = new LinkedHashMap<>(){{put(0, 22); put(1, 16); put(2, 10);}};

        TimingData toTimingData = new TimingData();
        toTimingData.withheld = true;
        // second line already exists
        TimingDataLinesItem item22 = new TimingDataLinesItem();
        item22.gapToLeader = "+0.198";
        toTimingData.lines = new LinkedHashMap<>();
        toTimingData.lines.put("2", item22);
        toTimingData.noEntries = new ArrayWrapper<>();
        toTimingData.noEntries.values = new LinkedHashMap<>(){{put(0, 0); put(1, 0); put(2, 0);}};
        Merger.mergeAllNotNull(toTimingData, fromTimingData);

        assertFalse(toTimingData.withheld);
        assertEquals(toTimingData.lines.size(), fromTimingData.lines.size());
        assertEquals("+0.198", toTimingData.lines.get("2").gapToLeader);
        assertEquals(2, toTimingData.lines.get("1").speeds.size());
        assertEquals("230", toTimingData.lines.get("1").speeds.get("S2").value);
        assertTrue(toTimingData.lines.get("1").speeds.get("S1").overallFastest);
        assertEquals("241", toTimingData.lines.get("2").speeds.get("S1").value);
        assertEquals(3, toTimingData.noEntries.values.size());
        assertEquals(16, toTimingData.noEntries.values.get(1));
    }

}

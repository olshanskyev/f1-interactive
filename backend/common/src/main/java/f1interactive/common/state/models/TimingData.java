package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import f1interactive.common.state.models.deserializer.ArrayWrapperDeserializer;
import f1interactive.common.state.models.deserializer.ArrayWrapperSerializer;
import f1interactive.common.state.models.merge.Merger;
import tools.jackson.databind.annotation.JsonDeserialize;
import tools.jackson.databind.annotation.JsonSerialize;

import java.util.LinkedHashMap;

public class TimingData implements UpdateEvent{
    @JsonProperty("Lines")
    public LinkedHashMap<String, TimingDataLinesItem> lines;
    @JsonProperty("Withheld")
    public Boolean withheld;
    public Boolean _kf;

    @JsonProperty("NoEntries")
    @JsonDeserialize(using = ArrayWrapperDeserializer.class)
    @JsonSerialize(using = ArrayWrapperSerializer.class)
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    public ArrayWrapper<Integer, Integer> noEntries = new ArrayWrapper<>();

    @JsonProperty("SessionPart")
    public Integer sessionPart;
    @JsonProperty("CutOffTime")
    public String cutOffTime;
    @JsonProperty("CutOffPercentage")
    public String cutOffPercentage;
    @Override
    public Root merge(Root state) {
        if (state.timingData == null)
            state.timingData = new TimingData();
        Merger.mergeAllNotNull(state.timingData, this);

        // if the incoming event contains bestLapTime value,
        // save the sectors as a BestLapTime.BestSectors
        if (this.lines != null) {
            this.lines.forEach((driver, timingDataLinesItem) -> {
                BestLapTime bestLapTime = timingDataLinesItem.bestLapTime;

                TimingDataLinesItem targetTimingByDriver = state.timingData.lines.get(driver);
                if (bestLapTime != null && "".equals(bestLapTime.value)
                        && targetTimingByDriver.bestLapTime != null) {
                    // clear best sectors if empty value comes (deleted value)
                    targetTimingByDriver.bestLapTime.bestSectors = null;
                } else if (bestLapTime != null
                        && bestLapTime.value != null
                        && !bestLapTime.value.isEmpty()
                        && targetTimingByDriver.bestLapTime != null
                        && targetTimingByDriver.sectors != null
                        && targetTimingByDriver.sectors.values != null
                ) {
                    LinkedHashMap<Integer, BestSectorsItem> bestSectors = new LinkedHashMap<>();
                    targetTimingByDriver.sectors.values.forEach((sectorKey, itemSector) -> {
                        BestSectorsItem bestSectorsItem = new BestSectorsItem();
                        bestSectorsItem.value = itemSector.value;
                        bestSectors.put(sectorKey, bestSectorsItem);
                    });
                    targetTimingByDriver.bestLapTime.bestSectors = bestSectors;
                    // enrich the incoming event too, so the published update carries the derived data
                    bestLapTime.bestSectors = new LinkedHashMap<>(bestSectors);
                }
            });
        }
        return state;
    }
}

package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import f1interactive.common.state.models.deserializer.ArrayWrapperDeserializer;
import f1interactive.common.state.models.deserializer.ArrayWrapperSerializer;
import f1interactive.common.state.models.merge.Merger;
import tools.jackson.databind.annotation.JsonDeserialize;
import tools.jackson.databind.annotation.JsonSerialize;

public class SessionData implements UpdateEvent {
    @JsonProperty("Series")
    @JsonDeserialize(using = ArrayWrapperDeserializer.class)
    @JsonSerialize(using = ArrayWrapperSerializer.class)
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    public ArrayWrapper<Integer, Series> series = new ArrayWrapper<>();
    @JsonProperty("StatusSeries")
    @JsonDeserialize(using = ArrayWrapperDeserializer.class)
    @JsonSerialize(using = ArrayWrapperSerializer.class)
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    public ArrayWrapper<Integer, StatusSeries> statusSeries = new ArrayWrapper<>();
    public Boolean _kf;

    @Override
    public Root merge(Root state) {
        if (state.sessionData == null)
            state.sessionData = new SessionData();
        if (this.series.fullState) {
            state.sessionData.series.values = null;
        }
        if (this.statusSeries.fullState) {
            state.sessionData.statusSeries.values = null;
        }
        state.sessionData.series.values = Merger.copyMapValues(this.series.values, state.sessionData.series.values);
        state.sessionData.statusSeries.values = Merger.copyMapValues(this.statusSeries.values, state.sessionData.statusSeries.values);
        return state;
    }
}

package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import f1interactive.common.state.models.deserializer.ArrayIntoMapDeserializer;

import java.util.LinkedHashMap;

public class SessionData implements UpdateEvent {
    @JsonProperty("Series")
    @JsonDeserialize(using = ArrayIntoMapDeserializer.class)
    public LinkedHashMap<Integer, Series> series = new LinkedHashMap<>();
    @JsonProperty("StatusSeries")
    @JsonDeserialize(using = ArrayIntoMapDeserializer.class)
    public LinkedHashMap<Integer, StatusSeries> statusSeries = new LinkedHashMap<>();
    public Boolean _kf;

    @Override
    public Root merge(Root state) {
        if (state.sessionData == null)
            state.sessionData = new SessionData();

        state.sessionData.series.putAll(this.series);
        state.sessionData.statusSeries.putAll(this.statusSeries);
        return state;
    }
}

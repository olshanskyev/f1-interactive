package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import f1interactive.common.state.models.deserializer.ArrayIntoMapDeserializer;
import f1interactive.common.state.models.merge.Merger;

import java.util.LinkedHashMap;

public class AudioStreams implements UpdateEvent{

    @JsonProperty("Streams")
    @JsonDeserialize(using = ArrayIntoMapDeserializer.class)
    public LinkedHashMap<Integer, StreamItem> streams = new LinkedHashMap<>();
    public Boolean _kf;

    @Override
    public Root merge(Root state) {
        if (state.audioStreams == null)
            state.audioStreams = new AudioStreams();
        Merger.mergeAllNotNull(state.contentStreams, this);
        return state;
    }
}

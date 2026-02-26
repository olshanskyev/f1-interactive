package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import f1interactive.common.state.models.deserializer.ArrayWrapperDeserializer;
import f1interactive.common.state.models.deserializer.ArrayWrapperSerializer;
import f1interactive.common.state.models.merge.Merger;
import tools.jackson.databind.annotation.JsonDeserialize;
import tools.jackson.databind.annotation.JsonSerialize;

public class ContentStreams implements UpdateEvent{

    @JsonProperty("Streams")
    @JsonDeserialize(using = ArrayWrapperDeserializer.class)
    @JsonSerialize(using = ArrayWrapperSerializer.class)
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    public ArrayWrapper<Integer, StreamItem> streams = new ArrayWrapper<>();
    public Boolean _kf;

    @Override
    public Root merge(Root state) {
        if (state.contentStreams == null)
            state.contentStreams = new ContentStreams();
        Merger.mergeAllNotNull(state.contentStreams, this);
        return state;
    }
}

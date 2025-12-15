package f1interactive.common.state.models.deserializer;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.*;
import f1interactive.common.state.models.PitTimes;

import java.io.IOException;
import java.util.ArrayList;


/**
 * in update events can come 2 different structure:
 * {"PitTimes":{"27":{"RacingNumber":"27","Duration":"21.6","Lap":"7"}},"_kf":true}
 * {"PitTimes":{"_deleted":["27"]}}
 */
public class PitTimesDeserializer extends JsonDeserializer<PitTimes>{

    public PitTimesDeserializer() {}

    @Override
    public PitTimes deserialize(JsonParser jsonParser, DeserializationContext ctxt) throws IOException {
        JsonNode node = jsonParser.getCodec().readTree(jsonParser);
        JsonNode _deleted = node.get("_deleted");
        PitTimes pitTimes = new PitTimes();
        if (_deleted != null && _deleted.isArray()) {
            pitTimes._deleted = new ArrayList<>();
            for (JsonNode itemDeleted: _deleted) {
                pitTimes._deleted.add(itemDeleted.asText());
            }
        } else {
            ObjectMapper objectMapper = new ObjectMapper();
            pitTimes.lines = objectMapper.treeToValue(node, new TypeReference<>() {});;
        }
        return pitTimes;
    }
}


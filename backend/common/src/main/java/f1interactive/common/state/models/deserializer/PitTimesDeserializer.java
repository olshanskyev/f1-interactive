package f1interactive.common.state.models.deserializer;

import f1interactive.common.state.models.PitTimes;
import f1interactive.common.state.models.PitTimesItem;
import tools.jackson.core.JsonParser;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.DeserializationContext;
import tools.jackson.databind.JavaType;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ValueDeserializer;
import tools.jackson.databind.node.ArrayNode;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Map;


/**
 * in update events can come 2 different structure:
 * {"PitTimes":{"27":{"RacingNumber":"27","Duration":"21.6","Lap":"7"}},"_kf":true}
 * {"PitTimes":{"_deleted":["27"]}}
 */
public class PitTimesDeserializer extends ValueDeserializer<PitTimes> {

    public PitTimesDeserializer() {}

    @Override
    public PitTimes deserialize(JsonParser p, DeserializationContext ctxt) {

        JsonNode node = p.readValueAsTree();
        JsonNode deletedNode = node.get("_deleted");
        PitTimes pitTimes = new PitTimes();

        if (deletedNode != null && deletedNode.isArray()) {
            pitTimes._deleted = new ArrayList<>();
            for (JsonNode itemDeleted : (ArrayNode) deletedNode) {
                pitTimes._deleted.add(itemDeleted.asText());
            }
        } else {
            JavaType mapType = ctxt.getTypeFactory().constructType(new TypeReference<LinkedHashMap<String, PitTimesItem>>() {});
            pitTimes.lines = ctxt.readTreeAsValue(node, mapType);
        }

        return pitTimes;
    }
}


package f1interactive.common.state.models.deserializer;

import f1interactive.common.state.models.ArrayWrapper;
import tools.jackson.core.JsonParser;
import tools.jackson.databind.*;
import tools.jackson.databind.node.ArrayNode;
import tools.jackson.databind.node.ObjectNode;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

/**
 * for cases where input can be as array (init message):
 * "RaceControlMessages": {"Messages": []}
 * 	or a map (update events)
 * 	RaceControlMessages: {"Messages":{"2":{...}}}
 * 	if values comes as array flag fullState is set to true to rewrite values by merging
 * 	and serialize it as array in ArrayWrapperSerializer
 */
public class ArrayWrapperDeserializer extends ValueDeserializer<ArrayWrapper<Integer, ?>> {

    private final JavaType elementType;

    public ArrayWrapperDeserializer() {
        this.elementType = null;
    }

    private ArrayWrapperDeserializer(JavaType elementType) {
        this.elementType = elementType;
    }

    @Override
    public ValueDeserializer<?> createContextual(DeserializationContext ctxt, BeanProperty property) {
        JavaType type = property.getType().containedType(1);
        return new ArrayWrapperDeserializer(type);
    }

    @Override
    public ArrayWrapper<Integer, ?> deserialize(JsonParser p, DeserializationContext ctxt) {

        var node = p.readValueAsTree();
        ArrayWrapper<Integer, Object> arrayWrapper = new ArrayWrapper<>();
        arrayWrapper.values = new LinkedHashMap<>();

        if (node instanceof ArrayNode arrayNode) {
            arrayWrapper.fullState = true;
            for (int i = 0; i < arrayNode.size(); i++) {
                Object value = ctxt.readTreeAsValue(arrayNode.get(i), elementType);
                arrayWrapper.values.put(i, value);
            }
        } else if (node instanceof ObjectNode objectNode) {
            arrayWrapper.fullState = false;
            Set<Map.Entry<String, JsonNode>> properties = objectNode.properties();
            for (Map.Entry<String, tools.jackson.databind.JsonNode> entry : properties) {
                Integer key = Integer.parseInt(entry.getKey());
                Object value = ctxt.readTreeAsValue(entry.getValue(), elementType);
                arrayWrapper.values.put(key, value);
            }
        }
        return arrayWrapper;
    }
}
package f1interactive.common.state.models.deserializer;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.deser.ContextualDeserializer;

import java.io.IOException;
import java.util.LinkedHashMap;


/**
 * for cases where input can be as array (init message):
 * "RaceControlMessages": {"Messages": []}
 * 	or a map (update events)
 * 	RaceControlMessages: {"Messages":{"2":{...}}}
 *
 */
public class ArrayIntoMapDeserializer extends JsonDeserializer<LinkedHashMap<Integer, ?>> implements ContextualDeserializer {

    private JavaType elementType;
    private JavaType arrayType;

    public ArrayIntoMapDeserializer() {}

    private ArrayIntoMapDeserializer(JavaType elementType, JavaType arrayType) {
        this.elementType = elementType;
        this.arrayType = arrayType;
    }

    @Override
    public JsonDeserializer<?> createContextual(DeserializationContext ctxt, BeanProperty property) {
        JavaType type = property.getType().containedType(1);
        JavaType parentType = property.getType();
        return new ArrayIntoMapDeserializer(type, parentType);
    }

    @Override
    public LinkedHashMap<Integer, ?> deserialize(JsonParser jsonParser, DeserializationContext ctxt) throws IOException {
        JsonNode node = jsonParser.getCodec().readTree(jsonParser);
        ObjectMapper objectMapper = new ObjectMapper();
        if (node.isArray()) {
            int i = 0;
            LinkedHashMap<Integer, ?> result = new LinkedHashMap<>();
            for (JsonNode item: node) {
                result.put(i, objectMapper.treeToValue(item, elementType));
                i++;
            }
            return result;
        } else {
            return objectMapper.treeToValue(node, arrayType);
        }
    }
}


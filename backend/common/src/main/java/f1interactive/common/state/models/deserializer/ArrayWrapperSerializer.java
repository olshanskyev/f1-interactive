package f1interactive.common.state.models.deserializer;


import f1interactive.common.state.models.ArrayWrapper;
import tools.jackson.core.JsonGenerator;

import tools.jackson.databind.SerializationContext;
import tools.jackson.databind.ValueSerializer;


/**
 * depends on flag fullState serialize as map or array
 */
public class ArrayWrapperSerializer extends ValueSerializer<ArrayWrapper<Integer, ?>> {

    @Override
    public boolean isEmpty(SerializationContext ctx, ArrayWrapper<Integer, ?> value) {
        return value == null || value.values == null;
    }

    @Override
    public void serialize(ArrayWrapper<Integer, ?> wrapper, JsonGenerator gen, SerializationContext ctxt) {

        if (wrapper.values == null) {
            gen.writeNull();
            return;
        }

        if (wrapper.fullState) {
            gen.writeStartArray(wrapper, wrapper.values.size());
            for (Object val : wrapper.values.values()) {
                ctxt.writeValue(gen, val);
            }
            gen.writeEndArray();
        } else {
            ctxt.writeValue(gen, wrapper.values);
        }
    }
}


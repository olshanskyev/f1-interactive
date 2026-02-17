package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public class PositionZ implements UpdateEvent{
    private final String value;

    @JsonCreator
    public PositionZ(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @Override
    public Root merge(Root state) {
        state.positionZ = new PositionZ(this.value);
        return state;
    }

}

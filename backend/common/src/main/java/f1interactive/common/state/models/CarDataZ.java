package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public class CarDataZ implements UpdateEvent {
    private final String value;

    @JsonCreator
    public CarDataZ(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @Override
    public Root merge(Root state) {
        state.carDataZ = new CarDataZ(this.value);
        return state;
    }
}

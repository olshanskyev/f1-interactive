package f1interactive.common.state;

import f1interactive.common.state.models.Root;
import f1interactive.common.state.models.UpdateEvent;
import org.springframework.stereotype.Component;

@Component
public class StateHandler {
    private Root state;

    public void init(Root initState) {
        state = initState;
    }

    public synchronized Root getState() { return this.state; }

    public synchronized void updateState(UpdateEvent updateEvent){
        if (state == null) {
            throw new RuntimeException("State handler not initialized");
        }
        this.state = updateEvent.merge(state);
    }
    public void cleanState() {this.state = null;}
}

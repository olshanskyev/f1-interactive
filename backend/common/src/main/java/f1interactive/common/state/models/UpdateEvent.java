package f1interactive.common.state.models;

public interface UpdateEvent {
    // takes state as parameter merge changes into state
    Root merge(Root state);
}

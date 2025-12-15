package f1interactive.common.websocket;

public interface F1LiveTimingProxy {
    void connect();
    void disconnect();
    void onInitStateMessage(InitialStateCallback callback);
    void onUpdateMessage(UpdateStateCallback callback);
}

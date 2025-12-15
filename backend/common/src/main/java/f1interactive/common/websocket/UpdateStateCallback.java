package f1interactive.common.websocket;

public interface UpdateStateCallback {
    void callback(String type, String message, String time);
}

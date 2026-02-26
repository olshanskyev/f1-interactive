package f1interactive.common.websocket.POJO;


import tools.jackson.databind.PropertyNamingStrategies;
import tools.jackson.databind.annotation.JsonNaming;

@JsonNaming(PropertyNamingStrategies.UpperCamelCaseStrategy.class)
public class NegotiationResponse {

    private String Url;
    private String ConnectionToken;
    private String ConnectionId;
    private int KeepAliveTimeout;
    private int DisconnectTimeout;
    private int ConnectionTimeout;
    private boolean TryWebSockets;
    private String ProtocolVersion;
    private int TransportConnectTimeout;
    private int LongPollDelay;

    public String getUrl() {
        return Url;
    }

    public void setUrl(String url) {
        Url = url;
    }

    public String getConnectionToken() {
        return ConnectionToken;
    }

    public void setConnectionToken(String connectionToken) {
        ConnectionToken = connectionToken;
    }

    public String getConnectionId() {
        return ConnectionId;
    }

    public void setConnectionId(String connectionId) {
        ConnectionId = connectionId;
    }

    public int getKeepAliveTimeout() {
        return KeepAliveTimeout;
    }

    public void setKeepAliveTimeout(int keepAliveTimeout) {
        KeepAliveTimeout = keepAliveTimeout;
    }

    public int getDisconnectTimeout() {
        return DisconnectTimeout;
    }

    public void setDisconnectTimeout(int disconnectTimeout) {
        DisconnectTimeout = disconnectTimeout;
    }

    public int getConnectionTimeout() {
        return ConnectionTimeout;
    }

    public void setConnectionTimeout(int connectionTimeout) {
        ConnectionTimeout = connectionTimeout;
    }

    public boolean isTryWebSockets() {
        return TryWebSockets;
    }

    public void setTryWebSockets(boolean tryWebSockets) {
        TryWebSockets = tryWebSockets;
    }

    public String getProtocolVersion() {
        return ProtocolVersion;
    }

    public void setProtocolVersion(String protocolVersion) {
        ProtocolVersion = protocolVersion;
    }

    public int getTransportConnectTimeout() {
        return TransportConnectTimeout;
    }

    public void setTransportConnectTimeout(int transportConnectTimeout) {
        TransportConnectTimeout = transportConnectTimeout;
    }

    public int getLongPollDelay() {
        return LongPollDelay;
    }

    public void setLongPollDelay(int longPollDelay) {
        LongPollDelay = longPollDelay;
    }
}

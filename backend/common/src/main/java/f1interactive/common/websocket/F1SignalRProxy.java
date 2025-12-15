package f1interactive.common.websocket;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import f1interactive.common.websocket.POJO.NegotiationResponse;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import java.net.InetSocketAddress;
import java.net.Proxy;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;


public class F1SignalRProxy implements F1LiveTimingProxy {

    private static final Logger logger = LoggerFactory.getLogger(F1SignalRProxy.class);

    private final String CONNECTION_DATA = URLEncoder.encode("[{\"name\":\"Streaming\"}]", StandardCharsets.UTF_8);
    private final String CLIENT_PROTOCOL = "1.5";
    private final String SUBSCRIBE_MESSAGE = "{\"H\":\"Streaming\",\"M\":\"Subscribe\",\"A\":[[\"Heartbeat\",\"CarData.z\",\"Position.z\",\"ExtrapolatedClock\",\"TopThree\",\"RcmSeries\",\"TimingStats\",\"TimingAppData\",\"WeatherData\",\"TrackStatus\",\"SessionStatus\",\"DriverList\",\"RaceControlMessages\",\"SessionInfo\",\"SessionData\",\"LapCount\",\"TimingData\",\"TeamRadio\",\"PitLaneTimeCollection\",\"ChampionshipPrediction\",\"PitStopSeries\"]],\"I\":1,}";

    private WebSocketClient f1wsClient;
    private UpdateStateCallback updateStateCallback;
    private InitialStateCallback initStateMessageCallback;

    @Override
    public void connect() {
        ResponseEntity<@NonNull NegotiationResponse> negotiationResponse = negotiate();
        List<String> setCookieHeaders = negotiationResponse.getHeaders().get("set-cookie");
        if (negotiationResponse.getBody() != null && negotiationResponse.getBody().getConnectionToken() != null) {
            connectws(negotiationResponse.getBody().getConnectionToken(), setCookieHeaders);
        } else {
            throw new RuntimeException("Negotiation error. Empty response body");
        }
    }

    @Override
    public void disconnect() {
        try {
            this.f1wsClient.closeBlocking();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void onUpdateMessage(UpdateStateCallback callback) {
        this.updateStateCallback = callback;
    }

    @Override
    public void onInitStateMessage(InitialStateCallback callback) {
        this.initStateMessageCallback = callback;
    }

    private ResponseEntity<@NonNull NegotiationResponse> negotiate() {

        String url = "https://livetiming.formula1.com/signalr/negotiate?connectionData=" +
                CONNECTION_DATA +
                "&clientProtocol=" +
                CLIENT_PROTOCOL;

        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.getForEntity(URI.create(url), NegotiationResponse.class);
    }

    private boolean needsProxy() {
        return (System.getProperty("https.proxyHost") != null);
    }

    private void connectws(String token, List<String> coockie) {
        String encodedToken = URLEncoder.encode(token, StandardCharsets.UTF_8);
        String url = "wss://livetiming.formula1.com/signalr/connect?clientProtocol="
                + CLIENT_PROTOCOL +
                "&transport=webSockets&connectionToken=" +
                encodedToken +
                "&connectionData=" +
                CONNECTION_DATA;
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.USER_AGENT, "BestHTTP");
        headers.add(HttpHeaders.ACCEPT_ENCODING, "gzip,identity");
        headers.addAll(HttpHeaders.COOKIE, coockie);

        f1wsClient = new WebSocketClient(URI.create(url), headers.toSingleValueMap()) {
            @Override
            public void onOpen(ServerHandshake handshakedata) {
                send(SUBSCRIBE_MESSAGE);
                logger.info("WebSocket connection opened to " + url);
            }

            @Override
            public void onMessage(String message) {
                ObjectMapper objectMapper = new ObjectMapper();
                try {
                    JsonNode jsonTree = objectMapper.readTree(message);
                    JsonNode initJson = jsonTree.get("R");
                    if (initJson != null && initStateMessageCallback != null) {
                        initStateMessageCallback.callback(initJson.toString());
                    }

                    // get update message from json
                    JsonNode updateMessage = jsonTree.get("C");
                    if (updateMessage != null && updateStateCallback != null) {
                        JsonNode messagePayloadArray = jsonTree.get("M");
                        if (messagePayloadArray.isArray()) {
                            for (final JsonNode objNode : messagePayloadArray) {
                                JsonNode dataArray = objNode.get("A");
                                //remove leading and trailing quotes
                                String type = dataArray.get(0).toString().replaceAll("^\"|\"$", "");
                                String time = dataArray.get(2).toString().replaceAll("^\"|\"$", "");
                                updateStateCallback.callback(type, dataArray.get(1).toString(), time);
                            }
                        }
                    }

                } catch (JsonProcessingException e) {
                    logger.error("Json Parsing error: {}", e.getMessage());
                }
            }

            @Override
            public void onClose(int code, String reason, boolean remote) {
                logger.info("Connection closed by " + (remote ? "remote peer" : "client.") + " Code: " + code + " Reason: "
                        + reason);
            }

            @Override
            public void onError(Exception ex) {
                //ToDo reconnect?
                ex.printStackTrace();
            }
        };

        if (needsProxy()) {
            f1wsClient.setDnsResolver(null);
            f1wsClient.setProxy(new Proxy(Proxy.Type.HTTP, new InetSocketAddress(System.getProperty("https.proxyHost"), Integer.parseInt(System.getProperty("https.proxyPort")))));
        }

        try {
            f1wsClient.connectBlocking();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}


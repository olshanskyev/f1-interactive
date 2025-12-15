package f1interactive.common.websocket;

import com.google.gson.JsonObject;
import com.microsoft.signalr.HubConnection;
import com.microsoft.signalr.HubConnectionBuilder;
import io.reactivex.rxjava3.core.Single;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Arrays;
import java.util.List;

public class F1SignalRCoreProxy implements F1LiveTimingProxy{

    private static final Logger logger = LoggerFactory.getLogger(F1SignalRCoreProxy.class);
    private HubConnection hubConnection;

    private final List<String> TOPICS = Arrays.asList(
            "Heartbeat",
            "ExtrapolatedClock",
            "TopThree",
            "RcmSeries",
            "TimingStats",
            "TimingAppData",
            "WeatherData",
            "TrackStatus",
            "DriverList",
            "RaceControlMessages",
            "SessionInfo",
            "SessionData",
            "SessionStatus",
            "LapCount",
            "TimingData",
            "TeamRadio",
            // Only available with subscription
            "CarData.z",
            "Position.z",
            "ChampionshipPrediction",
            "PitLaneTimeCollection",
            // Only available after a session?
            "PitStopSeries"
    );

    private UpdateStateCallback updateStateCallback;
    private InitialStateCallback initStateMessageCallback;


    @Override
    public void onInitStateMessage(InitialStateCallback callback) {
        this.initStateMessageCallback = callback;
    }

    @Override
    public void onUpdateMessage(UpdateStateCallback callback) {
        updateStateCallback = callback;
    }

    @Override
    public void connect() {
        hubConnection = HubConnectionBuilder.create("wss://livetiming.formula1.com/signalrcore")
                .withAccessTokenProvider(Single.defer(() -> Single.just((System.getProperty("formula1AccessToken") != null)?System.getProperty("formula1AccessToken"):"")))
                .build();

        hubConnection.on("feed", (type, message, dateTime) ->{
            if (updateStateCallback != null)
                updateStateCallback.callback(type,message.toString(),dateTime);
        }, String.class, JsonObject.class, String.class);

        hubConnection.onClosed( (ex -> {
            if (ex != null) {
                ex.printStackTrace();
            } else {
                logger.info("Connection closed");
            }
        }));

        hubConnection.start().blockingAwait();

        Single<JsonObject> subscribe = hubConnection.invoke(JsonObject.class, "Subscribe", TOPICS);
        if (subscribe != null)
            initStateMessageCallback.callback(subscribe.blockingGet().toString());
    }

    @Override
    public void disconnect() {
        hubConnection.close();
    }
}


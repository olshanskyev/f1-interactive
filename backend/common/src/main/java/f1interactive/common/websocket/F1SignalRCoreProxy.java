package f1interactive.common.websocket;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.microsoft.signalr.HubConnection;
import com.microsoft.signalr.HubConnectionBuilder;
import io.reactivex.rxjava3.core.Single;
import io.reactivex.rxjava3.disposables.CompositeDisposable;
import io.reactivex.rxjava3.disposables.Disposable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

public class F1SignalRCoreProxy implements F1LiveTimingProxy{

    private static final Logger logger = LoggerFactory.getLogger(F1SignalRCoreProxy.class);
    private HubConnection hubConnection;
    private final CompositeDisposable disposables = new CompositeDisposable();
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
            "AudioStreams",
            "ContentStreams",
            // Only available after a session?
            "PitStopSeries"
    );

    private UpdateStateCallback updateStateCallback;
    private InitialStateCallback initStateMessageCallback;
    private boolean isManualStop = false;

    @Override
    public void onInitStateMessage(InitialStateCallback callback) {
        this.initStateMessageCallback = callback;
    }

    @Override
    public void onUpdateMessage(UpdateStateCallback callback) {
        updateStateCallback = callback;
    }

    private void connectAndSubscribe() {
        disposables.clear();
        Disposable startDisposable = hubConnection.start()
            .subscribe(() -> {
                // successful connection, subscribe
                disposables.add(hubConnection.invoke(JsonObject.class, "Subscribe", TOPICS)
                    .subscribe(result -> {
                        if (initStateMessageCallback != null) {
                            initStateMessageCallback.callback(result.toString());
                        }
                    }, err -> {
                        logger.error("Subscribe error: {}", err.getMessage());
                    })
                );
            }, err -> {
                // error by starting, server not responds
                logger.error("Start error: {}", err.getMessage());
                reconnectAfterDelay();
            });
        disposables.add(startDisposable);
    }

    private void reconnectAfterDelay() {
        CompletableFuture.delayedExecutor(5, TimeUnit.SECONDS).execute(this::connectAndSubscribe);
    }


    @Override
    public void connect() {
        hubConnection = HubConnectionBuilder.create("wss://livetiming.formula1.com/signalrcore")
                .withAccessTokenProvider(Single.defer(() -> Single.just((System.getProperty("formula1AccessToken") != null)?System.getProperty("formula1AccessToken"):"")))
                .build();

        hubConnection.on("feed", (type, message, dateTime) ->{
            if (message == null) return;
            String event = (message instanceof String)?
                (String)message : (new Gson()).toJson(message);

            if (updateStateCallback != null)
                updateStateCallback.callback(type,event,dateTime);
        }, String.class, Object.class, String.class);

        hubConnection.onClosed( (ex -> {
            if (ex != null) {
                logger.error("Connection closed with error {}", ex.getMessage());
                reconnectAfterDelay();
            } else {
                if (isManualStop) {
                    logger.info("Connection closed by client");
                } else {
                    logger.info("Connection closed by server");
                    reconnectAfterDelay();
                }
            }
        }));

        connectAndSubscribe();
    }

    @Override
    public void disconnect() {
        isManualStop = true;
        disposables.dispose();
        hubConnection.close();
    }
}


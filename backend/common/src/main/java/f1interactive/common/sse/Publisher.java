package f1interactive.common.sse;


import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter.SseEventBuilder;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Component
public class Publisher {

    private static final Logger logger = LoggerFactory.getLogger(Publisher.class);

    Map<String, SseEmitter> consumers = new ConcurrentHashMap<>();
    ExecutorService heartbeatExecutor = Executors.newSingleThreadExecutor();

    @Value("${f1interactive.multithreading.threadsToParallelEvents:5}")
    private int threadsToParallelEvents;

    @Value("${f1interactive.multithreading.threadsToParallelConsumers:5}")
    private int threadsToParallelConsumers;

    @Value("${f1interactive.heartbeatIntervalMillis:15000}")
    private int heartbeatIntervalMillis;

    ExecutorService perEventExecutor;
    ExecutorService perConsumerEventExecutor;

    private boolean publisherActive = true;

    @Autowired
    ObjectMapper mapper;

    private void startHeartbeatThread() {
        heartbeatExecutor.execute(() -> {
            logger.info("Heartbeat thread started");
            while (publisherActive) {
                publish("heartbeat", "{\"Heartbeat\": " + "\"" + LocalDateTime.now() + "\"}");
                try {
                    Thread.sleep(heartbeatIntervalMillis);
                } catch (InterruptedException e) {
                    logger.warn("Interruption, ignoring");
                }
            }
        });
    }

    @PostConstruct
    private void init() {
        perEventExecutor = Executors.newFixedThreadPool(threadsToParallelEvents);
        perConsumerEventExecutor = Executors.newFixedThreadPool(threadsToParallelConsumers);
        startHeartbeatThread();
        logger.info("Publisher initiated. threadsToParallelEvents: {}, threadsToParallelConsumers: {}, heartbeatIntervalMillis: {}",
                threadsToParallelEvents, threadsToParallelConsumers, heartbeatIntervalMillis);
    }

    public void terminate() {
        consumers.forEach((uid, emitter) -> emitter.complete());
        publisherActive = false;
        logger.info("Publisher terminated");
    }



    private void sendToAll(String topic, String message) {
        consumers.forEach((uid,emitter) -> perConsumerEventExecutor.submit(() -> {
            try {
                SseEventBuilder event = SseEmitter.event()
                    .data(message)
                    .name(topic);
                emitter.send(event);
            } catch (Exception ex) { // can't send event, complete emitter
                emitter.completeWithError(ex);
            }
        }));
    }

    public void publish(String topic, Object message) {
        if (consumers.isEmpty() || !publisherActive)
            return;

        //serialize once before sending
        String strMessage;
        if (message instanceof String)
            strMessage = (String)message;
        else
            strMessage = mapper.writeValueAsString(message);
        perEventExecutor.execute(() -> sendToAll(topic, strMessage));

    }

    public SseEmitter subscribe() {
        String uid = UUID.randomUUID().toString();
        SseEmitter sseEmitter = new SseEmitter(0L); //0 timeout
        sseEmitter.onCompletion(() -> {
            consumers.remove(uid);
        }); // remove emitter from consumer
        sseEmitter.onError(throwable -> {
            consumers.remove(uid);
        });

        consumers.put(uid, sseEmitter);
        return sseEmitter;
    }
}

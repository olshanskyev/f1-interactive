package f1interactive.common.sse;


import java.time.LocalDateTime;
import java.util.Map;
import java.util.Queue;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter.SseEventBuilder;

import jakarta.annotation.PostConstruct;
import tools.jackson.databind.ObjectMapper;

/**
 * Fan-out of SSE events. Every consumer has its own ordered queue drained by at most one thread,
 * so a stalled client can't block the others; clients whose backlog exceeds maxPendingEvents are dropped.
 */
@Component
public class Publisher {

    private static final Logger logger = LoggerFactory.getLogger(Publisher.class);

    private final Map<String, Consumer> consumers = new ConcurrentHashMap<>();
    private final ObjectMapper mapper;
    private final int heartbeatIntervalMillis;
    private final int maxPendingEvents;
    private final int slowSendWarnMillis;

    private final ExecutorService sendExecutor = Executors.newCachedThreadPool(namedDaemonThreads("sse-send-"));
    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor(namedDaemonThreads("sse-scheduler-"));

    private volatile boolean publisherActive = true;

    public Publisher(ObjectMapper mapper,
                     @Value("${f1interactive.heartbeatIntervalMillis:15000}") int heartbeatIntervalMillis,
                     @Value("${f1interactive.sse.maxPendingEvents:300}") int maxPendingEvents,
                     @Value("${f1interactive.sse.slowSendWarnMillis:5000}") int slowSendWarnMillis) {
        this.mapper = mapper;
        this.heartbeatIntervalMillis = heartbeatIntervalMillis;
        this.maxPendingEvents = maxPendingEvents;
        this.slowSendWarnMillis = slowSendWarnMillis;
    }

    @PostConstruct
    void init() {
        scheduler.scheduleAtFixedRate(
                () -> publish("heartbeat", "{\"Heartbeat\": \"" + LocalDateTime.now() + "\"}"),
                heartbeatIntervalMillis, heartbeatIntervalMillis, TimeUnit.MILLISECONDS);
        logger.info("Publisher initiated. heartbeatIntervalMillis: {}, maxPendingEvents: {}, slowSendWarnMillis: {}",
                heartbeatIntervalMillis, maxPendingEvents, slowSendWarnMillis);
    }

    public void terminate() {
        publisherActive = false;
        scheduler.shutdownNow();
        consumers.values().forEach(consumer -> consumer.close(null));
        sendExecutor.shutdown();
        logger.info("Publisher terminated");
    }

    public void publish(String topic, Object message) {
        if (consumers.isEmpty() || !publisherActive)
            return;
        Event event = toEvent(topic, message);
        consumers.values().forEach(consumer -> consumer.offer(event));
    }

    public SseEmitter subscribe() {
        return subscribe(null, null);
    }

    /**
     * Subscribes a new consumer. If initMessage is not null, it is queued before any later published event.
     */
    public SseEmitter subscribe(String initTopic, Object initMessage) {
        SseEmitter emitter = newEmitter();
        Consumer consumer = new Consumer(UUID.randomUUID().toString(), emitter);
        emitter.onCompletion(consumer::remove);
        emitter.onError(throwable -> consumer.remove());
        if (initMessage != null)
            consumer.offer(toEvent(initTopic, initMessage));
        consumers.put(consumer.uid, consumer);
        logger.info("SSE consumer {} joined, consumers: {}", consumer.uid, consumers.size());
        return emitter;
    }

    int consumersCount() {
        return consumers.size();
    }

    SseEmitter newEmitter() {
        return new SseEmitter(0L); // no timeout
    }

    // serialized once for all consumers; SseEventBuilder is stateful and must be built per send
    private record Event(String topic, String data) {
        SseEventBuilder toBuilder() {
            return SseEmitter.event().data(data).name(topic);
        }
    }

    private Event toEvent(String topic, Object message) {
        String data = (message instanceof String str) ? str : mapper.writeValueAsString(message);
        return new Event(topic, data);
    }

    private static ThreadFactory namedDaemonThreads(String prefix) {
        AtomicInteger counter = new AtomicInteger();
        return runnable -> {
            Thread thread = new Thread(runnable, prefix + counter.incrementAndGet());
            thread.setDaemon(true);
            return thread;
        };
    }

    private final class Consumer {
        private final String uid;
        private final SseEmitter emitter;
        private final Queue<Event> queue = new ConcurrentLinkedQueue<>();
        private final AtomicInteger pending = new AtomicInteger();
        private final AtomicBoolean draining = new AtomicBoolean();
        private final AtomicBoolean closed = new AtomicBoolean();

        Consumer(String uid, SseEmitter emitter) {
            this.uid = uid;
            this.emitter = emitter;
        }

        void offer(Event event) {
            if (closed.get())
                return;
            int pendingEvents = pending.incrementAndGet();
            if (pendingEvents > maxPendingEvents) {
                logger.warn("Stale SSE consumer {} dropped: {} pending events exceed limit {}", uid, pendingEvents, maxPendingEvents);
                close(null);
                return;
            }
            queue.add(event);
            scheduleDrain();
        }

        private void scheduleDrain() {
            if (draining.compareAndSet(false, true))
                sendExecutor.execute(this::drain);
        }

        private void drain() {
            try {
                Event event;
                while (!closed.get() && (event = queue.poll()) != null) {
                    pending.decrementAndGet();
                    long start = System.nanoTime();
                    try {
                        emitter.send(event.toBuilder());
                    } catch (Exception ex) {
                        long blockedMillis = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - start);
                        if (blockedMillis >= slowSendWarnMillis)
                            logger.warn("Stale SSE consumer {} dropped: send blocked {} ms and failed: {}", uid, blockedMillis, ex.getMessage());
                        else
                            logger.debug("SSE consumer {} disconnected: {}", uid, ex.getMessage());
                        close(ex);
                        return;
                    }
                    long blockedMillis = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - start);
                    if (blockedMillis >= slowSendWarnMillis)
                        logger.warn("Slow SSE consumer {}: send blocked {} ms, {} events pending", uid, blockedMillis, pending.get());
                }
            } finally {
                draining.set(false);
            }
            // an event may have been queued after the last poll but before draining was reset
            if (!closed.get() && !queue.isEmpty())
                scheduleDrain();
        }

        /** Unregisters without touching the emitter; used by emitter callbacks. */
        void remove() {
            unregister();
        }

        /** Unregisters and completes the emitter off the caller thread, as complete() may block while a send is stuck. */
        void close(Throwable error) {
            if (!unregister())
                return;
            sendExecutor.execute(() -> {
                try {
                    if (error == null)
                        emitter.complete();
                    else
                        emitter.completeWithError(error);
                } catch (Exception ex) {
                    logger.debug("Can't complete SSE consumer {}: {}", uid, ex.getMessage());
                }
            });
        }

        /** Returns false if already unregistered. */
        private boolean unregister() {
            if (!closed.compareAndSet(false, true))
                return false;
            consumers.remove(uid);
            queue.clear();
            logger.info("SSE consumer {} left, consumers: {}", uid, consumers.size());
            return true;
        }
    }
}

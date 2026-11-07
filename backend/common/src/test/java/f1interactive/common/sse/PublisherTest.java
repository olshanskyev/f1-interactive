package f1interactive.common.sse;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import tools.jackson.databind.ObjectMapper;

import java.time.Duration;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Deque;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.function.BooleanSupplier;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;

class PublisherTest {

    private static final long HOUR_MILLIS = TimeUnit.HOURS.toMillis(1);

    static class RecordingEmitter extends SseEmitter {
        final List<String> received = Collections.synchronizedList(new ArrayList<>());

        RecordingEmitter() {
            super(0L);
        }

        @Override
        public void send(SseEventBuilder builder) {
            received.add(builder.build().stream().map(d -> d.getData().toString()).collect(Collectors.joining()));
        }
    }

    static class BlockingEmitter extends SseEmitter {
        final CountDownLatch entered = new CountDownLatch(1);
        final CountDownLatch release = new CountDownLatch(1);

        BlockingEmitter() {
            super(0L);
        }

        @Override
        public void send(SseEventBuilder builder) {
            entered.countDown();
            try {
                release.await();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }

    private Publisher publisher;
    private final List<BlockingEmitter> blockingEmitters = new ArrayList<>();

    private Publisher createPublisher(int maxPendingEvents, SseEmitter... emitters) {
        Deque<SseEmitter> queue = new ArrayDeque<>(List.of(emitters));
        for (SseEmitter emitter : emitters)
            if (emitter instanceof BlockingEmitter blocking)
                blockingEmitters.add(blocking);
        publisher = new Publisher(new ObjectMapper(), (int) HOUR_MILLIS, maxPendingEvents, 5000) {
            @Override
            SseEmitter newEmitter() {
                return queue.poll();
            }
        };
        return publisher;
    }

    @AfterEach
    void tearDown() {
        blockingEmitters.forEach(e -> e.release.countDown());
        if (publisher != null)
            publisher.terminate();
    }

    private static void awaitCondition(BooleanSupplier condition) throws InterruptedException {
        long deadline = System.nanoTime() + TimeUnit.SECONDS.toNanos(5);
        while (!condition.getAsBoolean()) {
            if (System.nanoTime() > deadline)
                fail("Condition not met within timeout");
            Thread.sleep(10);
        }
    }

    @Test
    void stalledConsumerDoesNotBlockOthersAndOrderIsPreserved() throws InterruptedException {
        BlockingEmitter stalled = new BlockingEmitter();
        RecordingEmitter healthy = new RecordingEmitter();
        Publisher publisher = createPublisher(1000, stalled, healthy);
        publisher.subscribe();
        publisher.subscribe();

        int events = 50;
        for (int i = 0; i < events; i++)
            publisher.publish("update", "{\"n\":" + i + "}");

        assertTrue(stalled.entered.await(5, TimeUnit.SECONDS));
        awaitCondition(() -> healthy.received.size() == events);
        for (int i = 0; i < events; i++)
            assertTrue(healthy.received.get(i).contains("{\"n\":" + i + "}"), "event " + i + " out of order");
    }

    @Test
    void staleConsumerIsDroppedWithoutBlockingPublish() throws InterruptedException {
        BlockingEmitter stalled = new BlockingEmitter();
        RecordingEmitter healthy = new RecordingEmitter();
        Publisher publisher = createPublisher(10, stalled, healthy);
        publisher.subscribe();
        publisher.subscribe();

        assertTimeoutPreemptively(Duration.ofSeconds(5), () -> {
            for (int i = 0; i < 20; i++) {
                publisher.publish("update", "{\"n\":" + i + "}");
                // let the healthy consumer keep up, so only the stalled one exceeds the limit
                int expected = i + 1;
                awaitCondition(() -> healthy.received.size() == expected);
            }
        });

        assertEquals(1, publisher.consumersCount());
    }

    @Test
    void initIsSentBeforeUpdates() throws InterruptedException {
        RecordingEmitter emitter = new RecordingEmitter();
        Publisher publisher = createPublisher(100, emitter);
        publisher.subscribe("init", "{\"state\":1}");
        publisher.publish("update", "{\"n\":1}");

        awaitCondition(() -> emitter.received.size() == 2);
        assertTrue(emitter.received.get(0).contains("event:init"));
        assertTrue(emitter.received.get(1).contains("event:update"));
    }
}

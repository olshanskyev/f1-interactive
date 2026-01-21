package f1interactive.tools.simulator;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

public class Simulator implements Player {

    public interface UpdateEventCallback {
        void callback(int eventNumber, String message, boolean isRewinding);
    }

    public interface InitEventCallback {
        void callback(String message, boolean isRewinding);
    }

    private static final Logger logger = LoggerFactory.getLogger(Simulator.class);

    private Simulator(){}

    private SimulatorState state = SimulatorState.NOT_INITIALIZED;
    private float playbackSpeedRatio = 1.0F;
    private int it = 0;
    private final ExecutorService singleThreadExecutor = Executors.newSingleThreadExecutor();
    private CompletableFuture<Void> nextEventFuture;
    private List<String> lines;
    private String fileName;
    private InitEventCallback initEventCallback;
    private UpdateEventCallback updateEventCallback;
    private Runnable rewindFinished;
    private Runnable endOfEventsCallback;

    public static Simulator init(InputStream inputStream, String fileName) throws IOException {
        Simulator simulator = new Simulator();
        try (InputStreamReader isr = new InputStreamReader(inputStream);
            BufferedReader br = new BufferedReader(isr)) {

            simulator.lines = br.lines().collect(Collectors.toList());
            simulator.fileName = fileName;
            simulator.state = SimulatorState.INITIALIZED;
            logger.info("Simulator initialized");
        }

        return simulator;
    }
    public static Simulator init(String inputFileName) throws IOException {
        Simulator simulator = new Simulator();
        // read file
        simulator.lines = Files.readAllLines(Paths.get(inputFileName));
        simulator.fileName = inputFileName;
        simulator.state = SimulatorState.INITIALIZED;
        logger.info("Simulator initialized");
        return simulator;
    }

    public void onUpdateEvent(UpdateEventCallback callback) {
        this.updateEventCallback = callback;
    }

    public void onInitEvent(InitEventCallback callback) {
        this.initEventCallback = callback;
    }

    public void onRewindFinished(Runnable callback) {
        this.rewindFinished = callback;
    }

    public void onEndOfEvents(Runnable callback) {
        this.endOfEventsCallback = callback;
    }

    /**
     * reads first init event (no delay)
     * @return millis from init event
     */
    private long readFirstEvent(boolean isRewinding) {
        String event = lines.get(it++);
        long currentMillis = TestDataReader.getMillisFromEvent(event);
        if (initEventCallback != null)
            initEventCallback.callback(event, isRewinding);
        return currentMillis;
    }

    private void readNextEvent(long preMillis) {
        if (lines.size() > it) {
            // read next element to calculate delay
            String nextEvent = lines.get(it);
            long currentMillis = TestDataReader.getMillisFromEvent(nextEvent);
            long delay = (preMillis == 0L)? 0L: (long)((currentMillis - preMillis) / playbackSpeedRatio);
            nextEventFuture = CompletableFuture.runAsync(() -> {
                String event = lines.get(it);
                if (updateEventCallback != null) {
                    updateEventCallback.callback(it, event, false);
                }
                it++;
                if (state == SimulatorState.STARTED)
                    readNextEvent(currentMillis);
            },
            CompletableFuture.delayedExecutor(delay, TimeUnit.MILLISECONDS,
            singleThreadExecutor));
        } else {
            logger.info("End of events. Simulator stopped");
            state = SimulatorState.STOPPED;
            if (endOfEventsCallback != null)
                endOfEventsCallback.run();
        }
    }

    private void resumeReading() {
        logger.info("Simulator resumed");
        readNextEvent(0L);
    }

    @Override
    public void start() {
        checkInitialized();
        if (state == SimulatorState.STARTED)
            return;
        if (state == SimulatorState.INITIALIZED || state == SimulatorState.STOPPED) {
            // first reading after initialization or stop
            // reset iterator
            it = 0;
            logger.info("Simulator started");
            long millis = readFirstEvent(false);
            readNextEvent(millis);
        } else { // resume reading
            resumeReading();
        }
        state = SimulatorState.STARTED;
    }

    @Override
    public void stop() {
        checkInitialized();
        if (nextEventFuture != null)
            nextEventFuture.cancel(true);
        logger.info("Simulator stopped");
        state = SimulatorState.STOPPED;
        it = 0;
    }

    @Override
    public void pause() {
        checkInitialized();
        if (state == SimulatorState.STARTED) {
            if (nextEventFuture != null)
                nextEventFuture.cancel(false);
            logger.info("Simulator paused");
            state = SimulatorState.PAUSED;
        }
    }

    @Override
    public void setPlaybackSpeedRatio(float ratio) {
        checkInitialized();
        if (ratio <= 0) {
            throw new IllegalArgumentException("Playback speed ratio can't be negative of zero");
        }
        playbackSpeedRatio = ratio;
        logger.info("New playback speed ratio {} set", playbackSpeedRatio);
        if (state == SimulatorState.STARTED) { // restart to rebuild waiting time
            pause();
            start();
        }
    }

    public int getNumberOfEvents() {
        checkInitialized();
        return lines.size();
    }

    public SimulatorState getState() {
        return state;
    }

    public float getPlaybackSpeedRatio() {
        return playbackSpeedRatio;
    }

    public String getFileName() {
        checkInitialized();
        return fileName;
    }

    public int getCurrentPosition() {
        checkInitialized();
        return it - 1;
    }


    private void checkInitialized() {
        assert state != SimulatorState.NOT_INITIALIZED;
    }

    @Override
    public void rewind(int position) {
        checkInitialized();
        if (position < 0 || position >= lines.size())
            throw new IllegalArgumentException("Position must be > 0 and < number of events");
        if (position == it) // nothing to do
            return;
        SimulatorState stateBeforeRewind = this.state;
        logger.info("Rewind to position {}", position);

        pause();
        if (position < it) { // start from 1 event
            it = 0;
        }
        if (it == 0) {
            readFirstEvent(true);
        }
        if (updateEventCallback != null) {
            while (it < position) {
                updateEventCallback.callback(it, lines.get(it), true);
                it++;
            }
        }

        if (rewindFinished != null)
            rewindFinished.run();
        if (stateBeforeRewind == SimulatorState.STARTED) {
            state = SimulatorState.STARTED;
            resumeReading();
        }
        else
            state = SimulatorState.PAUSED;
    }
}

package f1interactive.tools.simulator;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Scanner;
import java.util.function.Consumer;
import java.util.stream.Stream;

public class Simulator implements Player {
    private static final Logger logger = LoggerFactory.getLogger(Simulator.class);

    private Simulator(){}

    private SimulatorState state = SimulatorState.NOT_INITIALIZED;
    private float playbackSpeedRation = 1.0F;
    private Scanner scanner;
    private String fileName;
    private int numberOfEvents;
    private boolean readingFirstLine = false;

    private Thread sender;
    private final int MAX_WAIT_INTERVAL = 2000;
    private boolean interruptWaiting = false; // to interrupt waiting
    private Consumer<String> initEventCallback;
    private Consumer<String> updateEventCallback;

    public static Simulator init(String inputFileName) throws IOException {
        Simulator simulator = new Simulator();
        // read file
        simulator.fileName = inputFileName;

        try (Stream<String> fileStream = Files.lines(Paths.get(inputFileName))) {
            simulator.numberOfEvents =  (int)fileStream.count();
        }
        simulator.state = SimulatorState.INITIALIZED;
        logger.info("Simulator initialized");
        return simulator;
    }

    public void onUpdateEvent(Consumer<String> callback) {
        this.updateEventCallback = callback;
    }

    public void onInitEvent(Consumer<String> callback) {
        this.initEventCallback = callback;
    }

    @Override
    public void start() {
        checkInitialized();
        if (state == SimulatorState.STARTED)
            return;
        if (state == SimulatorState.INITIALIZED || state == SimulatorState.STOPPED) {
            // start new reading
            try {
                if (scanner != null)
                    scanner.close();
                scanner = new Scanner(new File(fileName));
                readingFirstLine = true;
            } catch (FileNotFoundException e) {
                throw new RuntimeException("Reading File Exception");
            }
        }
        // for PAUSED state just resume reading
        sender = new Thread(() -> {
            long preMillis = 0L;
            while (state == SimulatorState.STARTED && scanner.hasNextLine()) {
                String event = scanner.nextLine();
                long currentMillis = TestDataReader.getMillisFromEvent(event);
                try {
                    if (preMillis != 0L) {
                        long millisToSleep = (long)((currentMillis - preMillis) / playbackSpeedRation);
                        // sleeping with small intervals to make interruptable by stop/pause/new ratio events
                        long numberOfSleeps = millisToSleep / MAX_WAIT_INTERVAL + 1;
                        long lastSleepInterval = millisToSleep - MAX_WAIT_INTERVAL * (numberOfSleeps - 1);

                        if (millisToSleep > 0) {// if < 0 events are close, don't wait
                            interruptWaiting = false;
                            for (int i = 1; i <= numberOfSleeps
                                    && state == SimulatorState.STARTED
                                    && !interruptWaiting; i++) {
                                if (i == numberOfSleeps)
                                    Thread.sleep(lastSleepInterval);
                                else
                                    Thread.sleep(MAX_WAIT_INTERVAL);
                            }
                            interruptWaiting = false;
                        }
                    }
                    preMillis = currentMillis;
                    if (readingFirstLine) { // first line contains full init state
                        if (initEventCallback != null)
                            initEventCallback.accept(event);
                    } else {
                        if (updateEventCallback != null)
                            updateEventCallback.accept(event);
                    }
                    readingFirstLine = false;
                } catch (InterruptedException e){
                    logger.warn("Thread interrupted");
                    throw new RuntimeException(e);
                }

            }
            if (!scanner.hasNextLine()) { // end of file
                logger.info("End of file. Simulator stopped");
                state = SimulatorState.STOPPED;
                scanner.close();
                scanner = null;
            }
        });
        sender.start();
        state = SimulatorState.STARTED;
        logger.info("Simulator started");
    }

    @Override
    public void stop() {
        checkInitialized();
        state = SimulatorState.STOPPED;
        try {
            if (sender != null && sender.isAlive()) {
                logger.info("Waiting {} ms to stop simulator", MAX_WAIT_INTERVAL);

                sender.join(MAX_WAIT_INTERVAL + 10); // waiting thread stops
                if (sender.isAlive()) {
                    logger.info("Interrupting thread. Waited too long");
                    sender.interrupt();
                }

            }
        } catch (InterruptedException e) {
            throw new RuntimeException("Join sender thread error", e);
        } finally {
            if (scanner != null) {
                scanner.close();
                scanner = null;
            }

            logger.info("Simulator stopped");
        }
    }

    @Override
    public void pause() {
        checkInitialized();
        if (state == SimulatorState.STARTED) {
            state = SimulatorState.PAUSED;
            logger.info("Simulator paused");
        }
    }

    @Override
    public void setPlaybackSpeedRatio(float ratio) {
        checkInitialized();
        if (ratio <= 0) {
            throw new IllegalArgumentException("playback speed ratio can't be negative of zero");
        }
        playbackSpeedRation = ratio;
        interruptWaiting = true;

        logger.info("New playback speed ratio {} set", playbackSpeedRation);
    }

    public int getNumberOfEvents() {
        checkInitialized();
        return numberOfEvents;
    }

    public SimulatorState getState() {
        return state;
    }

    public float getPlaybackSpeedRation() {
        return playbackSpeedRation;
    }


    private void checkInitialized() {
        assert state != SimulatorState.NOT_INITIALIZED;
    }
}

package f1interactive.tools.simulator.controller;

import f1interactive.common.sse.Publisher;
import f1interactive.common.state.StateHandler;
import f1interactive.common.state.models.Root;
import f1interactive.common.state.models.deserializer.EventsParser;
import f1interactive.tools.simulator.Simulator;
import f1interactive.tools.simulator.SimulatorState;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;

@RestController
@RequestMapping("/simulator")
@CrossOrigin
class SimulatorApiController {
    private static final Logger logger = LoggerFactory.getLogger(SimulatorApiController.class);

    record InitSimulatorRequest(String fileName) {}
    record PlaybackSpeedRatioRequest(float playbackSpeedRatio) {}
    record RewindRequest(int position) {}
    record HttpErrorResponse(int code, String msg) {
        public HttpErrorResponse(String msg) {
            this(-1, msg);
        }
    }
    record SimulatorStateResponse(SimulatorState state, Integer numberOfEvents, String fileName, Float playbackSpeedRatio) {}
    record UpdateStateResponse(SimulatorState state){}
    record SetRatioResponse(float playbackSpeedRatio, SimulatorState state) {}
    record SimulatorEvent(int eventNumber, Object event) {}

    private Simulator simulator;
    private final Object initStateMutex = new Object();
    @Autowired
    private Publisher publisher;
    @Autowired
    private StateHandler stateHandler;

    private ResponseEntity<?> notInitializedError() {
        return new ResponseEntity<>(new HttpErrorResponse("Simulator not initialized"), HttpStatus.CONFLICT);
    }

    private void setSimulatorCallbacks() {
        simulator.onInitEvent((message, isRewinding) -> {
            Root initMessage = EventsParser.parseInitEvent(message);
            stateHandler.init(initMessage);
            if (!isRewinding)
                publisher.publish("init", new SimulatorEvent(0, initMessage));
            logger.debug("init: {}", message);
        });
        simulator.onUpdateEvent((eventNumber, message, isRewinding) -> {
            EventsParser.UpdateEventRecord updateEventRecord = EventsParser.parseUpdateEvent(message);
            synchronized (initStateMutex) {
                stateHandler.updateState(updateEventRecord.updateEvent());
                if (!isRewinding)
                    publisher.publish("update", new SimulatorEvent(eventNumber, updateEventRecord));
            }

            logger.debug("update: {}", message);
        });
        simulator.onEndOfEvents(() -> {
            publisher.publish("endOfEvents", "{}");
            logger.debug("endOfEvents");
        });

        simulator.onRewindFinished(() -> publisher.publish("init", new SimulatorEvent(simulator.getCurrentPosition(),stateHandler.getState())));

    }

    @PostMapping(value = "/init", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> initMultipartFile(@RequestPart(name = "file") MultipartFile file) {
        logger.debug("Got init simulator request with multipart file {}", file.getOriginalFilename());
        try {
            if (simulator != null) {
                simulator.stop();
            }
            simulator = Simulator.init(file.getInputStream(), file.getOriginalFilename());
            stateHandler.cleanState();
            setSimulatorCallbacks();
            return new ResponseEntity<>(new SimulatorStateResponse(simulator.getState(), simulator.getNumberOfEvents(), simulator.getFileName(), simulator.getPlaybackSpeedRatio()), HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>(new HttpErrorResponse("Error reading file"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(value = "/init", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> initFileName(@RequestBody InitSimulatorRequest initRequest) {
        logger.debug("Got init simulator request with filename {}", initRequest.fileName());
        try {
            if (simulator != null) {
                simulator.stop();
            }
            simulator = Simulator.init(initRequest.fileName());
            stateHandler.cleanState();
            setSimulatorCallbacks();
            return new ResponseEntity<>(new SimulatorStateResponse(simulator.getState(), simulator.getNumberOfEvents(), simulator.getFileName(), simulator.getPlaybackSpeedRatio()), HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>(new HttpErrorResponse("Error reading file"), HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping(value = "/start")
    public ResponseEntity<?> start() {
        logger.debug("Got start request");
        if (simulator == null)
            return notInitializedError();

        simulator.start();
        return new ResponseEntity<>(new UpdateStateResponse(simulator.getState()), HttpStatus.ACCEPTED);
    }

    @PostMapping(value = "/pause")
    public ResponseEntity<?> pause() {
        logger.debug("Got pause request");
        if (simulator == null)
            return notInitializedError();

        simulator.pause();
        return new ResponseEntity<>(new UpdateStateResponse(simulator.getState()), HttpStatus.ACCEPTED);
    }

    @PostMapping(value = "/stop")
    public ResponseEntity<?> stop() {
        logger.debug("Got stop request");
        if (simulator == null)
            return notInitializedError();

        simulator.stop();
        stateHandler.cleanState();
        return new ResponseEntity<>(new UpdateStateResponse(simulator.getState()), HttpStatus.ACCEPTED);
    }

    @PostMapping(value = "/playbackSpeedRatio")
    public ResponseEntity<?> playbackSpeedRatio(@RequestBody PlaybackSpeedRatioRequest ratioRequest) {
        logger.debug("Got playbackSpeedRatio request with ratio: {}", ratioRequest.playbackSpeedRatio);
        if (simulator == null)
            return notInitializedError();

        try {
            simulator.setPlaybackSpeedRatio(ratioRequest.playbackSpeedRatio);
        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(new HttpErrorResponse(ex.getMessage()), HttpStatus.CONFLICT);
        }
        return new ResponseEntity<>(new SetRatioResponse(simulator.getPlaybackSpeedRatio(), simulator.getState()), HttpStatus.ACCEPTED);

    }

    @GetMapping(path = "/live", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter live() throws IOException {
        synchronized (initStateMutex) {
            SseEmitter subscribe = publisher.subscribe();
            if (simulator != null && stateHandler.getState() != null) { // send one time init state
                SseEmitter.SseEventBuilder event = SseEmitter.event().data(new SimulatorEvent(simulator.getCurrentPosition(),stateHandler.getState())).name("init");
                subscribe.send(event);
            }
            return subscribe;
        }
    }

    @GetMapping(path = "state")
    public ResponseEntity<?> getState() {
        return (simulator == null)
            ? new ResponseEntity<>(new SimulatorStateResponse(SimulatorState.NOT_INITIALIZED, null, null, null), HttpStatus.OK)
            : new ResponseEntity<>(new SimulatorStateResponse(simulator.getState(), simulator.getNumberOfEvents(), simulator.getFileName(), simulator.getPlaybackSpeedRatio()), HttpStatus.OK);
    }

    @PostMapping(path = "rewind")
    public ResponseEntity<?> rewind(@RequestBody RewindRequest rewindRequest) {
        logger.debug("Got rewind request with position: {}", rewindRequest.position);
        if (simulator == null)
            return notInitializedError();
        try {
            simulator.rewind(rewindRequest.position);
        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(new HttpErrorResponse(ex.getMessage()), HttpStatus.CONFLICT);
        }
        return new ResponseEntity<>(new UpdateStateResponse(simulator.getState()), HttpStatus.ACCEPTED);
    }

    @PreDestroy
    void onDestroy() {
        if (simulator != null)
            simulator.stop();

        publisher.terminate();
    }

}

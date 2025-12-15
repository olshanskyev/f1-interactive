package f1interactive.tools.simulator.controller;

import f1interactive.common.sse.Publisher;
import f1interactive.tools.simulator.Simulator;
import f1interactive.tools.simulator.controller.types.HttpErrorResponse;
import f1interactive.tools.simulator.controller.types.InitSimulatorResponse;
import f1interactive.tools.simulator.controller.types.InitSimulatorRequest;
import f1interactive.tools.simulator.controller.types.PlaybackSpeedRatioRequest;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;

@RestController
@RequestMapping("/simulator")
@CrossOrigin
class SimulatorApiController {
    private static final Logger logger = LoggerFactory.getLogger(SimulatorApiController.class);

    private Simulator simulator;

    @Autowired
    private Publisher publisher;

    private ResponseEntity<?> notInitializedError() {
        return new ResponseEntity<>(new HttpErrorResponse("Simulator not initialized"), HttpStatus.CONFLICT);
    }


    @PostMapping(value = "/init")
    public ResponseEntity<?> init(@RequestBody InitSimulatorRequest initRequest) {
        logger.debug("Got init simulator request with file {} and ration {}", initRequest.getFileName(), initRequest.getPlaybackSpeedRatio());
        try {
            if (simulator != null) {
                simulator.stop();
            }
            simulator = Simulator.init(initRequest.getFileName());
            simulator.setPlaybackSpeedRatio(initRequest.getPlaybackSpeedRatio());
            simulator.onInitEvent(message -> publisher.publish("init", message));
            simulator.onUpdateEvent(message -> publisher.publish("update", message));
            return new ResponseEntity<>(new InitSimulatorResponse(simulator.getNumberOfEvents()), HttpStatus.OK);
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
        return new ResponseEntity<>(HttpStatus.ACCEPTED);

    }

    @PostMapping(value = "/pause")
    public ResponseEntity<?> pause() {
        logger.debug("Got pause request");
        if (simulator == null)
            return notInitializedError();

        simulator.pause();
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

    @PostMapping(value = "/stop")
    public ResponseEntity<?> stop() {
        logger.debug("Got stop request");
        if (simulator == null)
            return notInitializedError();

        simulator.stop();
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

    @PostMapping(value = "/playbackSpeedRation")
    public ResponseEntity<?> playbackSpeedRation(@RequestBody PlaybackSpeedRatioRequest ratioRequest) {
        logger.debug("Got playbackSpeedRation request with ratio: {}", ratioRequest.getPlaybackSpeedRatio());
        if (simulator == null)
            return notInitializedError();

        if (ratioRequest.getPlaybackSpeedRatio() <= 0)
            return new ResponseEntity<>(new HttpErrorResponse("Playback ration should be positive"), HttpStatus.CONFLICT);

        simulator.setPlaybackSpeedRatio(ratioRequest.getPlaybackSpeedRatio());
        return new ResponseEntity<>(HttpStatus.ACCEPTED);

    }

    @GetMapping(path = "/live", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter live() throws IOException {
        SseEmitter subscribe = publisher.subscribe();
        // if (simulator != null) {
        // String state = simulator.getMergedState();
        // SseEmitter.SseEventBuilder event = SseEmitter.event().data(state).name("init");
        // subscribe.send(event);
        //}
        return subscribe;
    }

    @PreDestroy
    void onDestroy() {
        if (simulator != null)
            simulator.stop();

        publisher.terminate();
    }

}

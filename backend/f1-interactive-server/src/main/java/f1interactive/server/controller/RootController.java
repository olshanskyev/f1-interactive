package f1interactive.server.controller;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import f1interactive.common.sse.Publisher;
import f1interactive.common.state.StateHandler;
import f1interactive.common.state.models.Root;
import f1interactive.common.state.models.SessionInfo;
import f1interactive.common.state.models.UpdateEvent;
import f1interactive.common.state.models.deserializer.EventsParser;
import f1interactive.common.websocket.F1LiveTimingProxy;
import f1interactive.server.models.HttpErrorResponse;
import f1interactive.server.models.Round;
import f1interactive.server.services.ScheduleService;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

@RestController
@RequestMapping("/")
class RootController {
    @Autowired
    private F1LiveTimingProxy f1Client;
    @Autowired
    private StateHandler stateHandler;
    @Autowired
    private Publisher publisher;
    private final Object initStateMutex = new Object();

    @Autowired
    private ScheduleService scheduleService;


    private void onInit(String event) {
        synchronized (initStateMutex) {
            Root initMessage = EventsParser.parseRoot(event);
            stateHandler.init(initMessage);
            publisher.publish("init", initMessage);
            logger.info("new init state: {}", stateHandler.getState());
        }
    }

    private void onUpdate(String type, String message, String time) {
        UpdateEvent updateEvent = EventsParser.parseUpdateEvent(type, message);
        EventsParser.UpdateEventRecord updateEventRecord = new EventsParser.UpdateEventRecord(type, updateEvent, System.currentTimeMillis());
        if (updateEventRecord.updateEvent() instanceof SessionInfo newSessionInfo) {
            // try to sync data with f1 if new session starts
            SessionInfo currentSessionInfo = stateHandler.getState().sessionInfo;
            if (currentSessionInfo == null ||
                    (newSessionInfo.key != null && !newSessionInfo.key.equals(currentSessionInfo.key))
            ) {
                logger.info("New session started, syncing...");
                f1Client.disconnect();
                f1Client.connect();
                return;
            }
        }
        synchronized (initStateMutex) {
            stateHandler.updateState(updateEvent);
            publisher.publish("update", updateEventRecord);
        }
        logger.debug("update: {}", message);
    }

    @PostConstruct
    void init() {
        f1Client.onInitStateMessage(this::onInit);
        f1Client.onUpdateMessage(this::onUpdate);
        f1Client.connect();
    }

    record UserResponse(String name, String avatar, String[] roles) {}
    private static final Logger logger = LoggerFactory.getLogger(RootController.class);

    @GetMapping(value = "/user")
    public ResponseEntity<?> user() throws Exception {
        logger.debug("user request");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String[] roles = authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority).toArray(String[]::new);
            return ResponseEntity.ok(new UserResponse(authentication.getName(), "images/admin.png", roles));
        } else {
            throw new RuntimeException("Not Authenticated");
        }
    }

    @GetMapping(path = "/live", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter live() throws IOException {
        synchronized (initStateMutex) {
            SseEmitter subscribe = publisher.subscribe();
            if (stateHandler.getState() != null) { // send one time init state
                SseEmitter.SseEventBuilder event = SseEmitter.event().data(stateHandler.getState()).name("init");
                subscribe.send(event);
            }
            return subscribe;
        }
    }

    @GetMapping(value = "/schedule")
    public ResponseEntity<?> schedule() throws Exception {
        logger.debug("get schedule request");
        CacheControl cacheControl = CacheControl.maxAge(2, TimeUnit.HOURS).cachePublic();
        int year = ZonedDateTime.now(ZoneId.of("UTC")).getYear();
        try {
            String json = StreamUtils.copyToString(
                    new ClassPathResource("schedule/" + year + ".json").getInputStream(),
                    StandardCharsets.UTF_8
            );
            return ResponseEntity.ok().
                    cacheControl(cacheControl).body(json);
        } catch (FileNotFoundException ex) {
            try {
                List<Round> rounds = scheduleService.getSchedule(year);
                return ResponseEntity.ok().
                        cacheControl(cacheControl).body(rounds);
            } catch (IOException e) {
                logger.error("Can't fetch schedule info. {}", e.getMessage());
                return new ResponseEntity<>(new HttpErrorResponse("Error by fetching schedule"), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

    }

    @GetMapping(value = "/circuits/{circuitId}")
    public ResponseEntity<?> circuit(@PathVariable String circuitId) throws Exception {
        logger.debug("get circuit request for circuitId: {}", circuitId);
        CacheControl cacheControl = CacheControl.maxAge(1, TimeUnit.DAYS).cachePublic();
        try {
            String json = StreamUtils.copyToString(
                    new ClassPathResource("circuits/" + circuitId + ".json").getInputStream(),
                    StandardCharsets.UTF_8
            );
            return ResponseEntity.ok().
                    cacheControl(cacheControl).body(json);
        } catch (FileNotFoundException ex) {
            return new ResponseEntity<>(new HttpErrorResponse("Circuit not found"), HttpStatus.NOT_FOUND);
        }
    }

    @PreDestroy
    void destroy() {
        f1Client.disconnect();
    }



}

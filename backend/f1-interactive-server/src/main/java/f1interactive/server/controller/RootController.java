package f1interactive.server.controller;

import f1interactive.common.sse.Publisher;
import f1interactive.common.state.StateHandler;
import f1interactive.common.state.models.Root;
import f1interactive.common.state.models.UpdateEvent;
import f1interactive.common.state.models.deserializer.EventsParser;
import f1interactive.common.websocket.F1LiveTimingProxy;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;

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

    private void onInit(String event) {
        Root initMessage = EventsParser.parseRoot(event);
        stateHandler.init(initMessage);
        publisher.publish("init", initMessage);
        logger.debug("init: {}", event);
    }

    private void onUpdate(String type, String message, String time) {
        UpdateEvent updateEvent = EventsParser.parseUpdateEvent(type, message);
        EventsParser.UpdateEventRecord updateEventRecord = new EventsParser.UpdateEventRecord(type, updateEvent, time);
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

    @PreDestroy
    void destroy() {
        f1Client.disconnect();
    }



}

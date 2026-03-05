package f1interactive.server.controller;

import f1interactive.common.websocket.F1LiveTimingProxy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
class AdminController {
    record LiveTokenRequest(String liveToken) {}

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    @Autowired
    private F1LiveTimingProxy f1Client;

    @PostMapping(value = "/setLiveToken")
    public ResponseEntity<?> setLiveToken(@RequestBody LiveTokenRequest token) throws Exception {
        System.setProperty("formula1AccessToken", token.liveToken);
        f1Client.disconnect();
        f1Client.connect();
        return ResponseEntity.ok(null);
    }

}

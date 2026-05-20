package f1interactive.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import f1interactive.common.websocket.F1LiveTimingProxy;

@RestController
@RequestMapping("/admin")
class AdminController {
    record LiveTokenRequest(String liveToken) {}

    private record VersionResponse(String version){}

    @Autowired
    private F1LiveTimingProxy f1Client;

    @PostMapping(value = "/live_token")
    public ResponseEntity<?> setLiveToken(@RequestBody LiveTokenRequest token) {
        System.setProperty("formula1AccessToken", token.liveToken);
        f1Client.disconnect();
        f1Client.connect();
        return ResponseEntity.ok(null);
    }

    @Value("${app.version}")
    private String version;

    @GetMapping(value = "/version")
    public ResponseEntity<?> version() {
        return ResponseEntity.ok(new VersionResponse(version));
    }

    @PostMapping(value="/sync_live_data")
    public ResponseEntity<?> sync() {
        f1Client.disconnect();
        f1Client.connect();
        return ResponseEntity.ok(null);
    }

}

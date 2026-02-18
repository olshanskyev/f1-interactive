package f1interactive.server.configuration;

import f1interactive.common.websocket.F1LiveTimingProxy;
import f1interactive.common.websocket.F1SignalRCoreProxy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class F1SignalConfiguration {
    @Bean
    public F1LiveTimingProxy configure() {
        return new F1SignalRCoreProxy();
    }
}

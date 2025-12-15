package f1interactive.tools.simulator;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages={"f1interactive.tools.simulator", "f1interactive.common"})
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }


}
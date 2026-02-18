package f1interactive.server;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"f1interactive.server", "f1interactive.common"})
public class Server {
    public static void main(String[] args) {
        SpringApplication.run(Server.class, args);
    }
}
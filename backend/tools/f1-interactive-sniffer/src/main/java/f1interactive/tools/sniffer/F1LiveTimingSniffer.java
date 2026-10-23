package f1interactive.tools.sniffer;



import f1interactive.common.state.models.SessionInfo;
import f1interactive.common.state.models.deserializer.EventsParser;
import f1interactive.common.websocket.F1LiveTimingProxy;
import f1interactive.common.websocket.F1SignalRCoreProxy;
import f1interactive.common.websocket.F1SignalRProxy;

import java.io.File;
import java.io.IOException;
import java.time.Instant;
import java.util.Scanner;
import java.util.concurrent.atomic.AtomicReference;

public class F1LiveTimingSniffer {

    public static void main(String[] args){

        if (args.length != 1) {
            System.out.println("Error: Expected 1 parameter");
            System.out.println("Usage: java -jar <sniffer.jar> <outputFileName>");
            new Scanner(System.in).nextLine();
            return;
        }
        String fileName = args[0];
        if (new File(fileName).isFile()) {
            System.out.println("Error: File already exists");
            new Scanner(System.in).nextLine();
            return;
        }

        F1LiveTimingProxy client = new F1SignalRCoreProxy();
        //F1LiveTimingProxy client = new F1SignalRProxy();
        // F1 doesn't reset every field of the previous session, so a new session needs a fresh init state, like the server does
        AtomicReference<Integer> sessionKey = new AtomicReference<>();

        try (FileEventsSaver saver = new FileEventsSaver(fileName, false)) {
            client.onInitStateMessage((message) -> {
                saver.save("Root" + "," + message + "," + Instant.now());
                SessionInfo sessionInfo = EventsParser.parseRoot(message).sessionInfo;
                sessionKey.set(sessionInfo != null ? sessionInfo.key : null);
            });
            client.onUpdateMessage((type, message, time) -> {
                saver.save(type+ "," + message + "," + time);
                if ("SessionInfo".equals(type)) {
                    SessionInfo sessionInfo = (SessionInfo) EventsParser.parseUpdateEvent(type, message);
                    if (sessionInfo.key != null && !sessionInfo.key.equals(sessionKey.get())) {
                        System.out.println("New session started, syncing...");
                        client.disconnect();
                        client.connect();
                    }
                }
            });
            client.connect();
            // waiting for nextLine input to close
            new Scanner(System.in).nextLine();
            client.disconnect();
        } catch (IOException e) {
            System.out.println("Writing File Error");
            new Scanner(System.in).nextLine();
        }

    }

}
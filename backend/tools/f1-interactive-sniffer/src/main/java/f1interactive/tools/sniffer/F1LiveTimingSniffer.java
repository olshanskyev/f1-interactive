package f1interactive.tools.sniffer;



import f1interactive.common.websocket.F1LiveTimingProxy;
import f1interactive.common.websocket.F1SignalRCoreProxy;

import java.io.File;
import java.io.IOException;
import java.util.Scanner;

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

        try (FileEventsSaver saver = new FileEventsSaver(fileName, false)) {
            client.onInitStateMessage(saver::save);
            client.onUpdateMessage((type, message, time) -> saver.save(type+ "," + message + "," + time));
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
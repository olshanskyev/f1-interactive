package f1interactive.tools.sniffer;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

public class FileEventsSaver implements AutoCloseable {
    private final FileWriter fw;
    private final BufferedWriter bw;

    public FileEventsSaver(String fileName, boolean append) throws IOException {
        fw = new FileWriter(fileName, append);
        bw = new BufferedWriter(fw);
    }

    @Override
    public void close() throws IOException {
        bw.close();
        fw.close();
    }

    public void save(String message) {
        try {
            System.out.print("=");
            bw.write(message);
            bw.newLine();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}

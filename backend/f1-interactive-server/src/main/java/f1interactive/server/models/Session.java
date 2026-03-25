package f1interactive.server.models;

import java.time.ZonedDateTime;

public class Session {
    private String kind;
    private ZonedDateTime start;
    private ZonedDateTime end;

    public Session(String kind, ZonedDateTime start, ZonedDateTime end) {
        this.kind = kind;
        this.start = start;
        this.end = end;
    }

    public String getKind() { return kind; }
    public void setKind(String kind) { this.kind = kind; }
    public ZonedDateTime getStart() { return start; }
    public void setStart(ZonedDateTime start) { this.start = start; }
    public ZonedDateTime getEnd() { return end; }
    public void setEnd(ZonedDateTime end) { this.end = end; }
}
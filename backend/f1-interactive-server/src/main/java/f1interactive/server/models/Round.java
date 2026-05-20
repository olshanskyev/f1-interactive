package f1interactive.server.models;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

public class Round {
    private String name;
    private String location;
    private String countryName;
    private ZonedDateTime start;
    private ZonedDateTime end;
    private List<Session> sessions = new ArrayList<>();

    public Round(String name, String countryName, ZonedDateTime start, ZonedDateTime end) {
        this.name = name;
        this.countryName = countryName;
        this.start = start;
        this.end = end;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getCountryName() { return countryName; }
    public void setCountryName(String countryName) { this.countryName = countryName; }
    public ZonedDateTime getStart() { return start; }
    public void setStart(ZonedDateTime start) { this.start = start; }
    public ZonedDateTime getEnd() { return end; }
    public void setEnd(ZonedDateTime end) { this.end = end; }
    public List<Session> getSessions() { return sessions; }
    public void setSessions(List<Session> sessions) { this.sessions = sessions; }
}

package f1interactive.server.services;

import f1interactive.server.models.Round;
import f1interactive.server.models.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLConnection;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ScheduleService {

    private static final Logger logger = LoggerFactory.getLogger(ScheduleService.class);
    private static final String CAL_URL = "https://ics.ecal.com/ecal-sub/69a02424a584fa0002277c33/Formula%201.ics";
    private static final Pattern NAME_PATTERN = Pattern.compile("FORMULA 1 (?<name>.+) - (?<kind>.+)");

    private ZonedDateTime parseIcalUtc(String dateString) {
        dateString = dateString.trim();
        int len = dateString.length();

        try {
            if (len == 8 && !dateString.contains("T")) {
                LocalDateTime localDateTime = LocalDateTime.parse(dateString + "T000000", DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss"));
                return localDateTime.atZone(ZoneId.of("UTC"));
            }

            if (dateString.endsWith("Z")) {
                LocalDateTime localDateTime = LocalDateTime.parse(dateString, DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss'Z'"));
                return localDateTime.atZone(ZoneId.of("UTC"));
            }

            if (dateString.contains("T")) {
                LocalDateTime localDateTime = LocalDateTime.parse(dateString, DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss"));
                return localDateTime.atZone(ZoneId.of("UTC"));
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse date string '" + dateString + "': " + e.getMessage(), e);
        }

        throw new RuntimeException("Failed to parse date string '" + dateString + "': unrecognized format");
    }

    private Round findRoundMut(List<Round> rounds, String name) {
        return rounds.stream()
                .filter(r -> r.getName().equals(name))
                .findFirst()
                .orElse(null);
    }

    private String[] parseName(String fullName) {
        Matcher matcher = NAME_PATTERN.matcher(fullName);
        if (matcher.find()) {
            return new String[]{matcher.group("name"), matcher.group("kind")};
        }
        return null;
    }

    protected java.io.InputStream getIcalInputStream() throws IOException {
        URL url;
        try {
            url = new URI(CAL_URL).toURL();
        } catch (URISyntaxException e) {
            logger.error("Unexpected URI format");
            throw new RuntimeException(e);
        }
        URLConnection connection = url.openConnection();
        return connection.getInputStream();
    }

    public List<Round> getSchedule(int year) throws IOException {
        logger.info("Download calendar for {}", year);
        List<Round> rounds = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(getIcalInputStream()))) {
            String line;
            String summary = null, location = null, dtstart = null, dtend = null;
            String lastKey = null;

            while ((line = reader.readLine()) != null) {
                if (line.startsWith(" ") && lastKey != null) {
                    if (lastKey.equals("SUMMARY") && summary != null) summary += line.substring(1);
                    else if (lastKey.equals("LOCATION") && location != null) location += line.substring(1);
                    continue;
                }

                if (line.startsWith("BEGIN:VEVENT")) {
                    summary = location = dtstart = dtend = null;
                    lastKey = null;
                } else if (line.startsWith("SUMMARY:")) {
                    summary = line.substring(8);
                    lastKey = "SUMMARY";
                } else if (line.startsWith("LOCATION:")) {
                    location = line.substring(9);
                    lastKey = "LOCATION";
                } else if (line.startsWith("DTSTART:") || line.startsWith("DTSTART;")) {
                    dtstart = line.substring(line.indexOf(':') + 1);
                    lastKey = "DTSTART";
                } else if (line.startsWith("DTEND:") || line.startsWith("DTEND;")) {
                    dtend = line.substring(line.indexOf(':') + 1);
                    lastKey = "DTEND";
                } else if (line.startsWith("END:VEVENT")) {
                    lastKey = null;
                    if (summary != null && location != null && dtstart != null && dtend != null) {
                        String[] parsed = parseName(summary);
                        if (parsed != null) {
                            String name = parsed[0];
                            String kind = parsed[1];

                            ZonedDateTime start = parseIcalUtc(dtstart);
                            ZonedDateTime end = parseIcalUtc(dtend);

                            Round existingRound = findRoundMut(rounds, name);
                            if (existingRound != null) {
                                existingRound.getSessions().add(new Session(kind, start, end));
                                if (start.isBefore(existingRound.getStart())) {
                                    existingRound.setStart(start);
                                }
                                if (end.isAfter(existingRound.getEnd())) {
                                    existingRound.setEnd(end);
                                }
                            } else {
                                if (start.getYear() == year) {
                                    Round newRound = new Round(name, location, start, end);
                                    newRound.getSessions().add(new Session(kind, start, end));
                                    rounds.add(newRound);
                                } else {
                                    logger.debug("Filtering round for year: {}", name);
                                }
                            }
                        }
                    }
                } else {
                    lastKey = null;
                }
            }
        }

        rounds.sort(Comparator.comparing(Round::getStart));
        for (Round round : rounds) {
            round.getSessions().sort(Comparator.comparing(Session::getStart));
        }

        return rounds;
    }

}

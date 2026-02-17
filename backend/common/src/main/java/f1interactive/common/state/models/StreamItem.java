package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

public class StreamItem {

    @JsonProperty("Type")
    public String type;
    @JsonProperty("Name")
    public String name;
    @JsonProperty("Language")
    public String language;
    @JsonProperty("Uri")
    public String uri;
    @JsonProperty("Path")
    public String path;
    @JsonProperty("Utc")
    public Date utc;
}

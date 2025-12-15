package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class WeatherData implements UpdateEvent{
    @JsonProperty("AirTemp")
    public String airTemp;
    @JsonProperty("Humidity") 
    public String humidity;
    @JsonProperty("Pressure") 
    public String pressure;
    @JsonProperty("Rainfall") 
    public String rainfall;
    @JsonProperty("TrackTemp") 
    public String trackTemp;
    @JsonProperty("WindDirection") 
    public String windDirection;
    @JsonProperty("WindSpeed") 
    public String windSpeed;
    public Boolean _kf;

    @Override
    public Root merge(Root state) {
        state.weatherData = this;
        return state;
    }
}

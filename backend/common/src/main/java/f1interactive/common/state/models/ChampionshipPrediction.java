package f1interactive.common.state.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import f1interactive.common.state.models.merge.Merger;

import java.util.Date;
import java.util.LinkedHashMap;

public class ChampionshipPrediction implements UpdateEvent{

    @JsonProperty("Drivers")
    public LinkedHashMap<String, DriverPredictionItem> drivers;

    @JsonProperty("Teams")
    public LinkedHashMap<String, TeamPredictionItem> teams;

    public Boolean _kf;

    @Override
    public Root merge(Root state) {
        if (state.championshipPrediction == null)
            state.championshipPrediction = new ChampionshipPrediction();
        Merger.mergeAllNotNull(state.championshipPrediction, this);
        return state;
    }
}

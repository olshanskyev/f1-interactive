package f1interactive.tools.simulator.controller.types;

public class InitSimulatorResponse {
    public InitSimulatorResponse(int numberOfEvents) {
        this.numberOfEvents = numberOfEvents;
    }

    public int getNumberOfEvents() {
        return numberOfEvents;
    }

    public void setNumberOfEvents(int numberOfEvents) {
        this.numberOfEvents = numberOfEvents;
    }

    private int numberOfEvents;
}

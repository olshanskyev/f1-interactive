package f1interactive.tools.simulator.controller.types;

public class InitSimulatorRequest {
    private String fileName;
    private float playbackSpeedRatio = 1.0F;

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public float getPlaybackSpeedRatio() {
        return playbackSpeedRatio;
    }

    public void setPlaybackSpeedRatio(float playbackSpeedRatio) {
        this.playbackSpeedRatio = playbackSpeedRatio;
    }
}

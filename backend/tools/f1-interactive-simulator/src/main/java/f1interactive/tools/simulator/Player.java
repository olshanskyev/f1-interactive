package f1interactive.tools.simulator;

public interface Player {
    void start();
    void stop();
    void pause();
    void setPlaybackSpeedRatio(float ratio);
    void rewind(int position);
}

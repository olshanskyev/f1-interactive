import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import { ContaineredWidget } from "../containered-widget";
import { SpeedoComponent } from "@shared/components/speedo/speedo";
import { CarData } from "@core/types/f1types";

@Component({
  selector: 'telemetry-widget',
  imports: [
    SpeedoComponent
  ],
  templateUrl: './telemetry-widget.html',
  styleUrl: './telemetry-widget.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    // set data-containered attribute when the widget is inside a container
    '[attr.data-containered]': 'container ? "true" : null'
  }
})
export class TelementryWidget extends ContaineredWidget {

    private readonly carData = this.liveService.getCarDataLiveSignal('max');

    public driver1 = input<number>();
    public driver2 = input<number>();

    getChannelValue(driver: number | undefined, channel: keyof CarData['Channels']): number | undefined {
        if (!this.carData() || !driver) return undefined;
        return this.carData()![driver]?.Channels[channel];
    }
    speed1 = computed(() => this.getChannelValue(this.driver1(), 2) ?? 0);
    speed2 = computed(() => this.getChannelValue(this.driver2(), 2) ?? 0);
    rpm1 = computed(() => this.getChannelValue(this.driver1(), 0) ?? 0);
    rpm2 = computed(() => this.getChannelValue(this.driver2(), 0) ?? 0);
    gear1 = computed(() => this.getChannelValue(this.driver1(), 3) ?? 0);
    gear2 = computed(() => this.getChannelValue(this.driver2(), 3) ?? 0);
    throttle1 = computed(() => this.getChannelValue(this.driver1(), 4) ?? 0);
    throttle2 = computed(() => this.getChannelValue(this.driver2(), 4) ?? 0);
    brake1 = computed(() => !!this.getChannelValue(this.driver1(), 5));
    brake2 = computed(() => !!this.getChannelValue(this.driver2(), 5));



}
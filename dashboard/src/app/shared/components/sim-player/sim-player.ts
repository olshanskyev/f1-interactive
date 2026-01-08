import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { SimulatorService, SimulatorState, SimulatorStateResponse } from '@core';
import { TranslateModule } from '@ngx-translate/core';
import { DebounceClickDirective } from '@shared/directives';
import { MatProgressBarModule } from '@angular/material/progress-bar'

@Component({
  selector: 'sim-player',
  templateUrl: './sim-player.html',
  styleUrl: './sim-player.scss',
  imports: [
    MatButtonModule, 
    MatIconModule, 
    MatCardModule, 
    TranslateModule, 
    DecimalPipe, 
    DebounceClickDirective,
    MatProgressBarModule
  ],
})
export class SimPlayer {
  private readonly simService = inject(SimulatorService);
  simulatorState = signal<SimulatorStateResponse>({state: 'NOT_INITIALIZED'});
  eventNumber = signal<number | undefined>(undefined);
  semaphoreColor = computed(() => 
    (this.simulatorState().state === 'INITIALIZED' || this.simulatorState().state === 'STOPPED')?'bg-red-50':
    (this.simulatorState().state === 'PAUSED')? 'bg-yellow-90':
    (this.simulatorState().state === 'STARTED')? 'bg-green-60':''
  );
  notInitialized = computed(() => this.simulatorState().state === 'NOT_INITIALIZED');
  started = computed(() => this.simulatorState().state === 'STARTED');
  paused = computed(() => this.simulatorState().state === 'PAUSED');
  progress = computed(() => ((this.eventNumber() != undefined) && this.simulatorState().numberOfEvents)
    ? ((this.eventNumber()! + 1) / this.simulatorState().numberOfEvents!) * 100
    : 0);

  newEvent = toSignal(this.simService.simulatorLive(
      () => this.eventNumber.set(0),
      undefined,
      () => this.onEndOfEvents(),
      this.eventNumber
  ));
  
  onEndOfEvents() {
    this.simService.state().subscribe(res => this.simulatorState.set(res));
  }

  constructor() {
    this.simService.state().subscribe(res => this.simulatorState.set(res));
  }

  onFileSelected(files: FileList | null) {
    if (files && files.length > 0) {
      this.simService.init(files[0])
      .subscribe(res => {
        this.simulatorState.set(res);
      });
    }
  }

  private updateState(state: SimulatorState) {
    this.simulatorState.update(curr => ({
        ...curr,
        state: state
      }));
  }

  private updateSpeedRatio(ratio: number) {
    this.simulatorState.update(curr => ({
        ...curr,
        playbackSpeedRatio: Number(ratio.toFixed(1))
      }));
  }

  onStartPause() {
    let call$;
    if (this.simulatorState().state === 'STARTED') {
      call$ = this.simService.pause();
    } else {
      call$ = this.simService.start();
    }
    call$.subscribe(res => this.updateState(res.state));
  }

  onStop() {
    this.simService.stop().subscribe(res => this.updateState(res.state));
  }

  adjustRatioUp() {
    const currRatio = this.simulatorState().playbackSpeedRatio;
    if (!currRatio || currRatio >= 10)
      return;
    const ratioStep = (currRatio >= 1)? 0.5: 0.2;
    this.updateSpeedRatio(currRatio + ratioStep);
  }

  adjustRatioDown() {
    const currRatio = this.simulatorState().playbackSpeedRatio;
    if (!currRatio || currRatio <= 0.2)
      return;
    const ratioStep = (currRatio > 1)? 0.5: 0.2;
    this.updateSpeedRatio(currRatio - ratioStep);
  }

  callUpdateRatio() {
    if (this.simulatorState().playbackSpeedRatio)
      this.simService.setRatio({"playbackSpeedRatio": this.simulatorState().playbackSpeedRatio!}).subscribe(res => this.updateSpeedRatio(res.playbackSpeedRatio));
  }

}

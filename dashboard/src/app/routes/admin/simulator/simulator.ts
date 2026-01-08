import { Component, inject } from '@angular/core';
import { SimulatorService } from '@core';
import { PageHeader, SimPlayer } from '@shared';

@Component({
  selector: 'app-simulator',
  templateUrl: './simulator.html',
  styleUrl: './simulator.scss',
  imports: [
    PageHeader,
    SimPlayer
  ],
})
export class Simulator {
}

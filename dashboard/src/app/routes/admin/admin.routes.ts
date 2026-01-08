import { Routes } from '@angular/router';
import { Simulator } from './simulator/simulator';


export const routes: Routes = [
  { path: '', redirectTo: 'simulator', pathMatch: 'full' },
  { path: 'simulator', component: Simulator },
];
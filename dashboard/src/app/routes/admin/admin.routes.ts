import { Routes } from '@angular/router';
import { UsersComponent } from './users/users';
import { ServerConfigurationComponent } from './server-configuration/server-configuration';


export const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users', component: UsersComponent },
  { path: 'server-configuration', component: ServerConfigurationComponent },
];
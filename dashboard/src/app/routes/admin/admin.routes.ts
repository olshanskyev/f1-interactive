import { Routes } from '@angular/router';
import { UsersComponent } from './users/users';
import { AppConfigurationComponent } from './app-configuration/app-configuration';


export const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users', component: UsersComponent },
  { path: 'app-configuration', component: AppConfigurationComponent },
];
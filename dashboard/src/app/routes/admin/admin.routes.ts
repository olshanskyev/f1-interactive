import { Routes } from '@angular/router';
import { UsersComponent } from './users/users';


export const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users', component: UsersComponent },
];
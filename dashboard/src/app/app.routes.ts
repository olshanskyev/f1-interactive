import { Routes } from '@angular/router';
import { adminGuard } from '@core';
import { AdminLayout } from '@theme/admin-layout/admin-layout';
import { AuthLayout } from '@theme/auth-layout/auth-layout';
import { DashboardComponent } from './routes/dashboard/dashboard';
import { Login } from './routes/sessions/login/login';
import { Error403 } from './routes/sessions/error-403';
import { Error404 } from './routes/sessions/error-404';
import { Error500 } from './routes/sessions/error-500';

export const routes: Routes = [
  {
    path: '',
    component: AdminLayout,
    //canActivate: [adminGuard],
    //canActivateChild: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'admin',
        canActivate: [adminGuard],
        canActivateChild: [adminGuard],
        loadChildren: () => import('./routes/admin/admin.routes').then(m => m.routes),
      },
      { path: '403', component: Error403 },
      { path: '404', component: Error404 },
      { path: '500', component: Error500 },
    ],
  },
  {
    path: 'auth',
    component: AuthLayout,
    children: [
      { path: 'login', component: Login },
    ],
  },

  { path: '**', redirectTo: 'dashboard' },
];

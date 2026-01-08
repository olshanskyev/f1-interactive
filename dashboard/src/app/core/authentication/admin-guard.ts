import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { NgxRolesService } from 'ngx-permissions';

export const adminGuard = (route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const rolesService = inject(NgxRolesService);

  return (auth.check() && rolesService.getRole('ADMIN')) ? true : router.parseUrl('/auth/login');
};

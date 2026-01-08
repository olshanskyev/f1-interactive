import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, of } from 'rxjs';

import { Menu } from '@core';
import { Token, User } from './interface';
import { NgxRolesService } from 'ngx-permissions';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  protected readonly http = inject(HttpClient);
  protected readonly roleService = inject(NgxRolesService);

  login(username: string, password: string, rememberMe = false) {
    return this.http.post<Token>('/auth/login', { username, password, rememberMe });
  }

  refresh(params: Record<string, any>) {
    return this.http.post<Token>('/auth/refresh', params);
  }

  logout() {
    return this.http.post<any>('/auth/logout', {});
  }

  user() {
    return this.http.get<User>('/user');
  }

  menu() {
    return (this.roleService.getRole('ADMIN'))?
      this.http.get<{ menu: Menu[] }>('data/menu_admin.json').pipe(map(res => res.menu))
        :
      this.http.get<{ menu: Menu[] }>('data/menu.json').pipe(map(res => res.menu));
  }

  defaultMenu() {
    return this.http.get<{ menu: Menu[] }>('data/menu.json').pipe(map(res => res.menu));
  }
}

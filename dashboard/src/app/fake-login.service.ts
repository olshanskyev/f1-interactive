import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { admin, LoginService, Menu } from '@core';

/**
 * You should delete this file in the real APP.
 */
@Injectable()
export class FakeLoginService extends LoginService {
  private token = { access_token: 'fake_access_token', token_type: 'bearer' };

  login() {
    return of(this.token);
  }

  refresh() {
    return of(this.token);
  }

  logout() {
    return of({});
  }

  user() {
    return of(admin);
  }

  menu() {
    return super.menu();
  }
}

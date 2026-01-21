import { Injectable, inject } from '@angular/core';
import { AuthService, User } from '@core/authentication';
import { NgxRolesService } from 'ngx-permissions';
import { switchMap, tap } from 'rxjs';
import { Menu, MenuService } from './menu.service';

@Injectable({
  providedIn: 'root',
})
export class StartupService {
  private readonly authService = inject(AuthService);
  private readonly menuService = inject(MenuService);
  private readonly rolesService = inject(NgxRolesService);

  private readonly allPermissions: {
        [name: string]: string[];
  } = {
    ADMIN: ['*'],
    USER: []
  };
  /**
   * Load the application only after get the menu or other essential informations
   * such as permissions and roles.
   */
  load() {
    return new Promise<void>((resolve, reject) => {
      this.authService
        .change()
        .pipe(
          tap(user => this.setPermissions(user)),
          switchMap(() => this.authService.menu()),
          tap(menu => this.setMenu(menu))
        )
        .subscribe({
          next: () => resolve(),
          error: () => resolve(),
        });
    });
  }

  private setMenu(menu: Menu[]) {
    this.menuService.addNamespace(menu, 'menu');
    this.menuService.set(menu);
  }

  private setPermissions(user: User) {
    this.rolesService.flushRolesAndPermissions();
    user.roles?.forEach(role => {
      if (role in this.allPermissions) {
        this.rolesService.addRoleWithPermissions(role, this.allPermissions[role]);
      }
    });

  }
}

import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NgxPermissionsModule, NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { LocalStorageService, MemoryStorageService } from '@shared/services/storage.service';
import { TokenService, User } from '@core/authentication';
import { MenuService } from '@core/bootstrap/menu.service';
import { StartupService } from '@core/bootstrap/startup.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { describe, beforeEach, afterEach, vi, it, expect } from 'vitest';

describe('StartupService', () => {
  let httpMock: HttpTestingController;
  let startup: StartupService;
  let tokenService: TokenService;
  let menuService: MenuService;
  let mockRolesService: NgxRolesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxPermissionsModule.forRoot()],
      providers: [
        {
          provide: LocalStorageService,
          useClass: MemoryStorageService,
        },
        {
          provide: NgxPermissionsService,
          useValue: {
            loadPermissions: (permissions: string[]) => void 0,
          },
        },
        {
          provide: NgxRolesService,
          useValue: {
            flushRolesAndPermissions: () => void 0,
            addRoleWithPermissions: (name: string, permissions: string[]) => void 0,
            getRole: (name: string) => void 0
          },
        },
        StartupService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
    startup = TestBed.inject(StartupService);
    tokenService = TestBed.inject(TokenService);
    menuService = TestBed.inject(MenuService);
    mockRolesService = TestBed.inject(NgxRolesService);

  });

  afterEach(() => httpMock.verify());

  it('should load menu when token changed and token valid', () => {
    const menu = { menu: [] };
    const admin: User = {
      id: 1,
      name: 'EugeneOff',
      email: 'olshanskyev@gmail.com',
      avatar: 'images/admin.png',
      roles: ['ADMIN']
    };

    const permissions = ['*'];
    vi.spyOn(menuService, 'addNamespace');
    vi.spyOn(menuService, 'set');

    vi.spyOn(mockRolesService, 'flushRolesAndPermissions');
    vi.spyOn(mockRolesService, 'addRoleWithPermissions');
    vi.spyOn(mockRolesService, 'getRole').mockReturnValue({name: admin.roles![0], validationFunction: ['*']});

    startup.load();
    httpMock.expectOne('data/menu.json'); //not authorized, load default menu

    tokenService.set({ access_token: 'token', token_type: 'bearer' });

    httpMock.expectOne('/user').flush(admin);
    httpMock.expectOne('data/menu_admin.json').flush(menu);

    expect(menuService.addNamespace).toHaveBeenCalledWith(menu.menu, 'menu');
    expect(menuService.set).toHaveBeenCalledWith(menu.menu);

    expect(mockRolesService.flushRolesAndPermissions).toHaveBeenCalledWith();
    expect(mockRolesService.addRoleWithPermissions).toHaveBeenCalledWith('ADMIN', permissions);

    // no admin role, default menu
    vi.spyOn(mockRolesService, 'getRole').mockReturnValue(undefined);
    tokenService.set({ access_token: 'token', token_type: 'bearer' });
    httpMock.expectOne('data/menu.json').flush(menu);
  });

  it('should load default menu when token changed and token invalid', () => {
    const defaultMenu = {
      menu: [
        {
          route: 'dashboard',
          name: 'dashboard',
          type: 'link',
          icon: 'dashboard'
        }
      ]
    };
    vi.spyOn(menuService, 'addNamespace');
    vi.spyOn(menuService, 'set');
    vi.spyOn(mockRolesService, 'getRole').mockReturnValue({name: 'ADMIN', validationFunction: ['*']});

    startup.load();
    httpMock.expectOne('data/menu.json').flush(defaultMenu);

    tokenService.set({ access_token: '', token_type: 'bearer' });

    httpMock.expectOne('data/menu.json');

    expect(menuService.addNamespace).toHaveBeenCalledWith(defaultMenu.menu, 'menu');
    expect(menuService.set).toHaveBeenCalledWith(defaultMenu.menu);
  });
});

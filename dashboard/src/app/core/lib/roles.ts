import { NgxRolesObject } from 'ngx-permissions';

export function isAdmin(roles: NgxRolesObject | undefined): boolean {
    return roles?.['ADMIN'] != null;
}
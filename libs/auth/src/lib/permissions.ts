import { Role } from '@veppagunta-3e04c8a7-fdc2-4182-bde1-2f1fe496aee6/data';

export enum Permission {
    TaskRead = 'TaskRead',
    TaskWrite = 'TaskWrite',
    AuidtRead = 'AuditRead'
}


export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
    [Role.Owner]: [Permission.TaskRead, Permission.TaskWrite, Permission.AuidtRead],
    [Role.Admin]: [Permission.TaskRead, Permission.TaskWrite, Permission.AuidtRead],
    [Role.Viewer]: [Permission.TaskRead]
}


export function hasPermission(role: Role, Perm: Permission): boolean {
    return ROLE_PERMISSIONS[role]?.includes(Perm) ?? false;
}
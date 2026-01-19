import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '@veppagunta-3e04c8a7-fdc2-4182-bde1-2f1fe496aee6/auth';
import { Role } from '@veppagunta-3e04c8a7-fdc2-4182-bde1-2f1fe496aee6/data';
import { JwtPayload } from '../auth/jwt.types';



@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(ctx: ExecutionContext): boolean {
        const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            ctx.getHandler(),
            ctx.getClass(),
        ]);


        if (!roles || roles.length === 0) return true;
        const req = ctx.switchToHttp().getRequest();
        const user = req.user as JwtPayload | undefined;
        if (!user) throw new ForbiddenException('Missing user context');
        const ok = roles.includes(user.role);
        if (!ok) throw new ForbiddenException('Insufficient role');
    
        return true;
    }
}
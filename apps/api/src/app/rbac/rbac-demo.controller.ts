import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '@veppagunta-3e04c8a7-fdc2-4182-bde1-2f1fe496aee6/auth';
import { Role } from '@veppagunta-3e04c8a7-fdc2-4182-bde1-2f1fe496aee6/data';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from './roles.guard';


@Controller('rbac-demo')
export class RbacDemoController {
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Owner, Role.Admin)
    @Get('admin-only')
    adminOnly() {
        return { ok: true, message: 'Owner/Admin can see this' };
    }
}
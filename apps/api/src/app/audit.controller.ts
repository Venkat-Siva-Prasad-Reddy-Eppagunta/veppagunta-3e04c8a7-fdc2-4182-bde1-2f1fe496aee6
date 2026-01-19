import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from '@veppagunta-3e04c8a7-fdc2-4182-bde1-2f1fe496aee6/auth';
import { Role } from '@veppagunta-3e04c8a7-fdc2-4182-bde1-2f1fe496aee6/data';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './rbac/roles.guard';
import { AuditLog } from './entities/audit-log.entity';



@Controller('audit-log')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditController {
    
    constructor(
        @InjectRepository(AuditLog) private readonly auditRepo: Repository<AuditLog>
    ) { }

    @Roles(Role.Owner, Role.Admin)
    @Get()
    async list() {
        return this.auditRepo.find({ order: { timestamp: 'DESC' } });
    }
}
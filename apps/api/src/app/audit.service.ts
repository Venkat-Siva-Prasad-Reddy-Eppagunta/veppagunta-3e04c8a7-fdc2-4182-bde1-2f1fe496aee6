import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';


@Injectable()
export class AuditService {
    private readonly logger = new Logger(AuditService.name);

    constructor(
        @InjectRepository(AuditLog) private readonly auditRepo: Repository<AuditLog>
    ) {}

    async log(
        params: {
            userId: string;
            action: string;
            resourceType: string;
            resourceId?: string;
            allowed: boolean;
            reason?: string;
        }) 
    {
        const entry = this.auditRepo.create({
            userId: params.userId,
            action: params.action,
            resourceType: params.resourceType,
            resourceId: params.resourceId,
            allowed: params.allowed,
            reason: params.reason,
        });

    await this.auditRepo.save(entry);


    this.logger.log(
      `${params.allowed ? 'ALLOW' : 'DENY'} user=${params.userId} action=${params.action} resource=${params.resourceType}:${params.resourceId ?? '-'} reason=${params.reason ?? '-'}`
    );
  }
}
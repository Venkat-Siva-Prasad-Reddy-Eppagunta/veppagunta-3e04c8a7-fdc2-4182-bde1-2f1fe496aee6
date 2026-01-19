import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AuditLog } from './entities/audit-log.entity';
import { Organization } from './entities/organization.entity';
import { Task } from './entities/task.entity';
import { User } from './entities/user.entity';
import { SeedService } from './seed.service';
import { AuditService } from './audit.service';
import { RbacDemoController } from './rbac/rbac-demo.controller';
import { TasksController } from './tasks/tasks.controller';
import { AuditController } from './audit.controller';
import { OrgScopeService } from './org-scope.service';
import { TasksService } from './tasks/tasks.service';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Organization, User, Task, AuditLog],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Organization, User, Task, AuditLog]),
    AuthModule,
  ],
  controllers:[RbacDemoController, TasksController, AuditController],
  providers: [SeedService, AuditService, OrgScopeService, TasksService],
})

export class AppModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { Organization } from './entities/organization.entity';
import { Task } from './entities/task.entity';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Organization, User, Task, AuditLog],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Organization, User, Task, AuditLog]),
  ],
})
export class AppModule {}
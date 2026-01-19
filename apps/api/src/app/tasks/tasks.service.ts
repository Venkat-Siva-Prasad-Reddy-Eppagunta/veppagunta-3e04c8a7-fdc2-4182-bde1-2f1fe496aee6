import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  CreateTaskDto,
  UpdateTaskDto,
} from '@veppagunta-3e04c8a7-fdc2-4182-bde1-2f1fe496aee6/data';
import { AuditService } from '../audit.service';
import { Task } from '../entities/task.entity';
import { User } from '../entities/user.entity';
import { OrgScopeService } from '../org-scope.service';


@Injectable()
export class TasksService {
  
    constructor(
        @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        private readonly orgScope: OrgScopeService,
        private readonly audit: AuditService
    ) {}

    async createTask(params: { userId: string; userOrgId: string; dto: CreateTaskDto }) {
        const { userId, userOrgId, dto } = params;

        const user = await this.userRepo.findOne({ where: { id: userId }, relations: { org: true } });
        if (!user) throw new NotFoundException('User not found');

        const task = this.taskRepo.create({
            title: dto.title,
            description: dto.description ?? null,
            category: dto.category,
            status: dto.status,
            orderIndex: 0,
            org: user.org,
            createdBy: user,
        });

        const saved = await this.taskRepo.save(task);

        await this.audit.log({
            userId,
            action: 'TASK_CREATE',
            resourceType: 'Task',
            resourceId: saved.id,
            allowed: true,
        });

    return saved;
  }

    async listAccessibleTasks(params: { userId: string; userOrgId: string }) {
        const { userId, userOrgId } = params;
        const allowedOrgIds = await this.orgScope.allowedOrgIdsForUserOrg(userOrgId);

        const tasks = await this.taskRepo.find({
            where: { 
                org: { 
                    id: In(allowedOrgIds) 
                } 
            },
            order: { 
                orderIndex: 'ASC', 
                title: 'ASC' 
            },
        });

        await this.audit.log({
            userId,
            action: 'TASK_LIST',
            resourceType: 'Task',
            allowed: true,
        });

    return tasks;
  }

    async updateTask(params: {
        userId: string;
        userOrgId: string;
        taskId: string;
        dto: UpdateTaskDto;
    }) {
    const { userId, userOrgId, taskId, dto } = params;

    const allowedOrgIds = await this.orgScope.allowedOrgIdsForUserOrg(userOrgId);

    const task = await this.taskRepo.findOne({ where: { id: taskId }, relations: { org: true } });
    if (!task) throw new NotFoundException('Task not found');

    if (!allowedOrgIds.includes(task.org.id)) {
        await this.audit.log({
            userId,
            action: 'TASK_UPDATE',
            resourceType: 'Task',
            resourceId: taskId,
            allowed: false,
            reason: 'OUT_OF_SCOPE',
        });
        throw new ForbiddenException('Task out of org scope');
    }

    Object.assign(task, {
        title: dto.title ?? task.title,
        description: dto.description ?? task.description,
        category: dto.category ?? task.category,
        status: dto.status ?? task.status,
    });

    const saved = await this.taskRepo.save(task);

    await this.audit.log({
        userId,
        action: 'TASK_UPDATE',
        resourceType: 'Task',
        resourceId: taskId,
        allowed: true,
    });

    return saved;
  }

  async deleteTask(params: { userId: string; userOrgId: string; taskId: string }) {
    const { userId, userOrgId, taskId } = params;

    const allowedOrgIds = await this.orgScope.allowedOrgIdsForUserOrg(userOrgId);

    const task = await this.taskRepo.findOne({ where: { id: taskId }, relations: { org: true } });
    if (!task) throw new NotFoundException('Task not found');

    if (!allowedOrgIds.includes(task.org.id)) {
        await this.audit.log({
            userId,
            action: 'TASK_DELETE',
            resourceType: 'Task',
            resourceId: taskId,
            allowed: false,
            reason: 'OUT_OF_SCOPE',
        });
        throw new ForbiddenException('Task out of org scope');
    }

    await this.taskRepo.remove(task);

    await this.audit.log({
        userId,
        action: 'TASK_DELETE',
        resourceType: 'Task',
        resourceId: taskId,
        allowed: true,
    });

    return { deleted: true };
  }
}
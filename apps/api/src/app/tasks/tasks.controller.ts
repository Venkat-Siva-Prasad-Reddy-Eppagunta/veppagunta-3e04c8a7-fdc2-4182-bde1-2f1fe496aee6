import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Roles } from '@veppagunta-3e04c8a7-fdc2-4182-bde1-2f1fe496aee6/auth';
import { CreateTaskDto, Role, UpdateTaskDto } from '@veppagunta-3e04c8a7-fdc2-4182-bde1-2f1fe496aee6/data';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtPayload } from '../auth/jwt.types';
import { RolesGuard } from '../rbac/roles.guard';
import { TasksService } from './tasks.service';



@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
    
    constructor(private readonly tasksService: TasksService) { }

    @Roles(Role.Owner, Role.Admin)
    @Post()
    create(@CurrentUser() user: JwtPayload, @Body() dto: CreateTaskDto) {
        return this.tasksService.createTask({ userId: user.sub, userOrgId: user.orgId, dto });
    }

    @Roles(Role.Owner, Role.Admin, Role.Viewer)
    @Get()
    list(@CurrentUser() user: JwtPayload) {
        return this.tasksService.listAccessibleTasks({ userId: user.sub, userOrgId: user.orgId });
    }

    @Roles(Role.Owner, Role.Admin)
    @Put(':id')
    update(@CurrentUser() user: JwtPayload, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
        return this.tasksService.updateTask({ userId: user.sub, userOrgId: user.orgId, taskId: id, dto });
    }

    @Roles(Role.Owner, Role.Admin)
    @Delete(':id')
    remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
        return this.tasksService.deleteTask({ userId: user.sub, userOrgId: user.orgId, taskId: id });
    }
}
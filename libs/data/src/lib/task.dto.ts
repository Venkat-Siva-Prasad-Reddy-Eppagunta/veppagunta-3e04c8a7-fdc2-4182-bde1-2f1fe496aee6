import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { TaskCategory, TaskStatus } from './enums';

export class CreateTaskDto {
  @IsString()
  @MaxLength(120)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsEnum(TaskCategory)
  category!: TaskCategory;

  @IsEnum(TaskStatus)
  status!: TaskStatus;
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsEnum(TaskCategory)
  category?: TaskCategory;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
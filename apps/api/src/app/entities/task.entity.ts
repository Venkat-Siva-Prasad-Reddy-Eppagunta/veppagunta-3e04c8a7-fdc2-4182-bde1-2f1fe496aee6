import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Organization } from './organization.entity';
import { User } from './user.entity';
import { TaskCategory, TaskStatus } from '@veppagunta-3e04c8a7-fdc2-4182-bde1-2f1fe496aee6/data';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description?: string | null;

  @Column({ type: 'text' })
  category!: TaskCategory;

  @Column({ type: 'text' })
  status!: TaskStatus;

  @Column({ type: 'int', default: 0 })
  orderIndex!: number;

  @ManyToOne(() => Organization, { eager: true })
  org!: Organization;

  @ManyToOne(() => User, { eager: true })
  createdBy!: User;
}
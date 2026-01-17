import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column()
  action!: string;

  @Column()
  resourceType!: string;

  @Column({ nullable: true })
  resourceId?: string;

  @Column()
  allowed!: boolean;

  @Column({ nullable: true })
  reason?: string;

  @CreateDateColumn()
  timestamp!: Date;
}
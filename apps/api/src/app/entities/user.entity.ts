import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Organization } from './organization.entity';
import { Role } from '@veppagunta-3e04c8a7-fdc2-4182-bde1-2f1fe496aee6/data';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column({ type: 'text' })
  role!: Role;

  @ManyToOne(() => Organization, { eager: true })
  org!: Organization;
}
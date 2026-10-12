import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MerchantApplication } from './merchant-application.entity';
import { UserToken } from './user-token.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'password', type: 'varchar', select: false })
  password: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true, select: false })
  deletedAt: Date;

  @OneToMany(() => MerchantApplication, (application) => application.user)
  submittedApplications: MerchantApplication[];

  @OneToMany(() => UserToken, (token) => token.user)
  tokens: UserToken[];
}

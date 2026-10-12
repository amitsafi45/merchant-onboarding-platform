import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Admin } from './admin.entity';

@Entity('admin_tokens')
export class AdminToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'token', type: 'text', unique: true })
  token: string;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Index()
  @Column({ name: 'admin_id', type: 'uuid' })
  adminId: string;

  @ManyToOne(() => Admin, (admin) => admin.tokens)
  @JoinColumn({ name: 'admin_id' })
  admin: Admin;
}

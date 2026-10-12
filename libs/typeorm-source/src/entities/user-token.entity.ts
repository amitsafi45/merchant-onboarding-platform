import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_tokens')
export class UserToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'token', type: 'text', unique: true })
  token: string;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Index()
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.tokens)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

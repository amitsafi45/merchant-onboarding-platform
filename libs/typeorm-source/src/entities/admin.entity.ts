import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AdminRole } from '@app/common';
import { AdminToken } from './admin-token.entity';
import { RiskReview } from './risk-reviews.entity';

@Entity('admin')
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: AdminRole,
  })
  role: AdminRole;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true, select: false })
  deletedAt: Date;

  @OneToMany(() => AdminToken, (token) => token.admin)
  tokens: AdminToken[];

  @OneToMany(() => RiskReview, (riskReview) => riskReview.reviewer)
  riskReviews: RiskReview[];
}

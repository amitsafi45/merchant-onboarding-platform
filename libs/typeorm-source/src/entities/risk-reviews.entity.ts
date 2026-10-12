import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RiskDecision, RiskReviewStatus } from '@app/common';
import { MerchantApplication } from './merchant-application.entity';
import { Admin } from './admin.entity';

@Entity('risk_reviews')
export class RiskReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: RiskReviewStatus,
    default: RiskReviewStatus.PENDING,
  })
  status: RiskReviewStatus;

  @Column({
    type: 'enum',
    enum: RiskDecision,
    nullable: true,
  })
  decision: RiskDecision | null;

  @Column({ type: 'integer', nullable: true })
  score: number | null;

  @Column({ type: 'text', nullable: true })
  reason: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'application_id', type: 'uuid', unique: true })
  applicationId: string;

  @OneToOne(
    () => MerchantApplication,
    (application) => application.riskReview,
    { nullable: false },
  )
  @JoinColumn({ name: 'application_id' })
  application: MerchantApplication;

  @Column({ name: 'reviewer_id', type: 'uuid', nullable: true })
  reviewerId: string | null;

  @ManyToOne(() => Admin, (admin) => admin.riskReviews, {
    nullable: true,
  })
  @JoinColumn({ name: 'reviewer_id' })
  reviewer: Admin | null;

  /**
   * Reference identifier returned by the external KYB or risk-assessment provider.
   * Nullable when no external provider reference is available.
   */
  @Column({
    name: 'provider_reference',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  providerReference: string | null;

  @Column({
    name: 'is_auto_analysis_completed',
    type: 'boolean',
    default: false,
  })
  isAutoAnalysisCompleted: boolean;
}

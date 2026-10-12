import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ApplicationStatus, TransactionType } from '@app/common';
import { RiskReview } from './risk-reviews.entity';

@Entity('merchant_applications')
export class MerchantApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'business_name', type: 'varchar' })
  businessName: string;

  @Column({ name: 'legal_business_name', type: 'varchar' })
  legalBusinessName: string;

  @Column({ name: 'business_type', type: 'varchar' })
  businessType: string;

  @Column({ name: 'owner_name', type: 'varchar' })
  ownerName: string;

  @Column({ name: 'owner_email', type: 'varchar' })
  ownerEmail: string;

  @Column({ name: 'owner_phone', type: 'varchar' })
  ownerPhone: string;

  @Column({
    name: 'requested_processing_volume',
    type: 'numeric',
    precision: 15,
    scale: 2,
  })
  requestedProcessingVolume: string;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.DRAFT,
  })
  status: ApplicationStatus;

  @Column({
    name: 'requested_transaction_type',
    type: 'enum',
    enum: TransactionType,
  })
  requestedTransactionType: TransactionType;

  @Column({
    name: 'business_registration_number',
    type: 'varchar',
    nullable: true,
  })
  businessRegistrationNumber: string | null;

  @Column({ name: 'business_website', type: 'varchar', nullable: true })
  businessWebsite: string | null;

  @Column({ name: 'business_address', type: 'text', nullable: true })
  businessAddress: string | null;

  @Column({
    name: 'tax_identification_number',
    type: 'varchar',
    nullable: true,
  })
  taxIdentificationNumber: string | null;
  @Index()
  @Column({ name: 'submitted_by', type: 'uuid' })
  submittedBy: string;

  @ManyToOne(() => User, (user) => user.submittedApplications, {
    nullable: false,
  })
  @JoinColumn({ name: 'submitted_by' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true, select: false })
  deletedAt: Date;

  @OneToOne(() => RiskReview, (riskReview) => riskReview.application)
  riskReview: RiskReview;
}

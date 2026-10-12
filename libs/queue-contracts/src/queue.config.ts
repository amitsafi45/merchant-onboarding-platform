import { ApplicationStatus, TransactionType } from '@app/common';

export const QueueNameConfig = {
  MERCHANT_RISK_REVIEW_QUEUE: 'MERCHANT_RISK_REVIEW_QUEUE',
} as const;

export const jobName = {
  PROCESS_RISK_REVIEW_JOB: 'PROCESS_RISK_REVIEW_JOB',
} as const;

export interface AddedEvent {
  jobId: string;
}

export interface ActiveEvent {
  jobId: string;
  prev?: string;
}

export interface CompletedEvent {
  jobId: string;
  returnvalue: AnalyzerResult;
}

export interface FailedEvent {
  jobId: string;
  failedReason: string;
}

export interface AnalyzerResult {
  userId: string;
  message: string;
}

export interface MerchantApplicationPayload {
  businessName: string;
  legalBusinessName: string;
  businessType: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  requestedProcessingVolume: string;
  status: ApplicationStatus;
  requestedTransactionType: TransactionType;
  businessRegistrationNumber: string | null;
  businessWebsite: string | null;
  businessAddress: string | null;
  taxIdentificationNumber: string | null;
  submittedBy: string;
}
export interface RiskReviewJobPayload {
  jobId: string;
  payload: MerchantApplicationPayload;
}

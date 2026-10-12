export enum Environment {
  Development = 'development',
  Production = 'production',
}

export enum AdminRole {
  ADMIN = 'ADMIN',
  REVIEWER = 'REVIEWER',
}
export enum RiskReviewStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  REQUEST_INFORMATION = 'REQUEST_INFORMATION',
  COMPLETED = 'COMPLETED',
}

export enum RiskDecision {
  PASS = 'PASS',
  FAIL = 'FAIL',
}
export enum ApplicationStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  REQUEST_INFORMATION = 'REQUEST_INFORMATION',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum RiskStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PASSED = 'PASSED',
  FAILED = 'FAILED',
}
export enum TransactionType {
  CARD_PAYMENT = 'CARD_PAYMENT',
  BANK_TRANSFER = 'BANK_TRANSFER',
  DIGITAL_WALLET = 'DIGITAL_WALLET',
}

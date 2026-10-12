import { RiskReviewStatus } from '@app/common';

export interface CreateRiskReviewInput {
  applicationId: string;
  status?: RiskReviewStatus;
  score?: number | null;
  reason?: string | null;
  providerReference?: string | null;
  isAutoAnalysisCompleted?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

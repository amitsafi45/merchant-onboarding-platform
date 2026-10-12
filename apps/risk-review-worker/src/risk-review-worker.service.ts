import {
  AnalyzerResult,
  RiskReviewJobPayload,
  QueueNameConfig,
} from '@app/queue-contracts';
import { RiskReviewsService } from '@app/typeorm-source';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { randomUUID } from 'node:crypto';

@Injectable()
@Processor(QueueNameConfig.MERCHANT_RISK_REVIEW_QUEUE)
export class RiskReviewWorkerService extends WorkerHost {
  private readonly logger = new Logger(RiskReviewWorkerService.name);

  constructor(private readonly riskReviewsService: RiskReviewsService) {
    super();
  }

  /**
   * Processes a merchant risk-review job.
   */
  async process(
    job: Job<RiskReviewJobPayload, AnalyzerResult>,
  ): Promise<AnalyzerResult> {
    return this.processRiskReview(job);
  }

  /**
   * Performs a mock risk assessment and persists the result.
   */
  private async processRiskReview(
    job: Job<RiskReviewJobPayload, AnalyzerResult>,
  ): Promise<AnalyzerResult> {
    const { jobId: applicationId, payload: application } = job.data;

    this.logger.log(`Processing risk review: ${applicationId}`);

    const score = this.calculateRiskScore(application);
    const providerReference = `MOCK-KYB-${randomUUID()}`;

    const message =
      score >= 70
        ? 'Application flagged for manual review.'
        : 'Automated risk assessment completed.';

    await this.riskReviewsService.create({
      applicationId,
      score,
      reason: message,
      providerReference,
      isAutoAnalysisCompleted: true,
    });

    this.logger.log(
      `Risk assessment persisted: application=${applicationId}, score=${score}`,
    );

    return {
      userId: application.submittedBy,
      message,
    };
  }

  /**
   * Calculates an illustrative mock risk score.
   */
  private calculateRiskScore(
    application: RiskReviewJobPayload['payload'],
  ): number {
    let score = 10;

    if (!application.businessRegistrationNumber) {
      score += 25;
    }

    if (!application.taxIdentificationNumber) {
      score += 25;
    }

    if (!application.businessAddress) {
      score += 15;
    }

    if (!application.businessWebsite) {
      score += 5;
    }

    return Math.min(score, 100);
  }

  /**
   * Handles a successfully completed job.
   */
  @OnWorkerEvent('completed')
  onCompleted(job: Job<RiskReviewJobPayload>): void {
    this.logger.log(`Completed: ${job.id}`);
  }

  /**
   * Handles a failed job.
   */
  @OnWorkerEvent('failed')
  onFailed(job: Job<RiskReviewJobPayload> | undefined, error: Error): void {
    this.logger.error(`Failed: ${job?.id}: ${error.message}`, error.stack);
  }
}

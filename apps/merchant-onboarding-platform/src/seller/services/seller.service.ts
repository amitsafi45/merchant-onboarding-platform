import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ApplicationStatus } from '@app/common';
import {
  jobName,
  MerchantApplicationPayload,
  QueueNameConfig,
  RiskReviewJobPayload,
} from '@app/queue-contracts';
import {
  CreateMerchantApplicationDto,
  UpdateMerchantApplicationDto,
} from '../dto/seller.dto';
import { MerchantApplicationService } from '@app/typeorm-source';

@Injectable()
export class SellerService {
  constructor(
    private readonly merchantApplicationService: MerchantApplicationService,
    @InjectQueue(QueueNameConfig.MERCHANT_RISK_REVIEW_QUEUE)
    private readonly merchantRiskReviewQueue: Queue<RiskReviewJobPayload>,
  ) {}

  /**
   * Creates a merchant application and queues risk assessment
   * when the application is submitted.
   *
   * @param input - Merchant application details.
   * @param userId - ID of the authenticated seller.
   * @returns The created merchant application.
   */
  async createApplication({
    input,
    userId,
  }: {
    input: CreateMerchantApplicationDto;
    userId: string;
  }) {
    const application = await this.merchantApplicationService.create({
      input,
      userId,
    });

    if (application.status === ApplicationStatus.SUBMITTED) {
      await this.queueRiskReview(application);
    }

    return application;
  }

  /**
   * Updates an application owned by the seller.
   * Only draft and information-requested applications are editable.
   * Risk assessment is queued when the application is resubmitted.
   *
   * @param applicationId - ID of the application to update.
   * @param input - Application fields to update.
   * @param userId - ID of the authenticated seller.
   * @returns The updated merchant application.
   * @throws HttpException if the application is not found or is not editable.
   */
  async updateApplication({
    applicationId,
    input,
    userId,
  }: {
    applicationId: string;
    input: UpdateMerchantApplicationDto;
    userId: string;
  }) {
    const application =
      await this.merchantApplicationService.getOwnApplicationById({
        applicationId,
        userId,
      });

    if (!application) {
      throw new HttpException(
        'Merchant application not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (
      application.status !== ApplicationStatus.DRAFT &&
      application.status !== ApplicationStatus.REQUEST_INFORMATION
    ) {
      throw new HttpException(
        'Only draft or information-requested applications can be updated.',
        HttpStatus.FORBIDDEN,
      );
    }

    const updatedApplication = await this.merchantApplicationService.update({
      applicationId,
      input,
      userId,
    });

    if (
      updatedApplication.status === ApplicationStatus.SUBMITTED &&
      input.status === ApplicationStatus.SUBMITTED
    ) {
      await this.queueRiskReview(updatedApplication);
    }

    return updatedApplication;
  }

  /**
   * Retrieves applications submitted by the authenticated seller.
   *
   * @param userId - ID of the authenticated seller.
   * @returns The seller's merchant applications.
   */
  async getOwnApplications(userId: string) {
    return this.merchantApplicationService.getOwnApplications(userId);
  }

  /**
   * Adds a merchant application to the risk-review queue.
   *
   * @param application - The application to assess.
   */
  private async queueRiskReview(
    application: MerchantApplicationPayload & { id: string },
  ): Promise<void> {
    const jobPayload: RiskReviewJobPayload = {
      jobId: application.id,
      payload: {
        businessName: application.businessName,
        legalBusinessName: application.legalBusinessName,
        businessType: application.businessType,
        ownerName: application.ownerName,
        ownerEmail: application.ownerEmail,
        ownerPhone: application.ownerPhone,
        requestedProcessingVolume: application.requestedProcessingVolume,
        status: application.status,
        requestedTransactionType: application.requestedTransactionType,
        businessRegistrationNumber: application.businessRegistrationNumber,
        businessWebsite: application.businessWebsite,
        businessAddress: application.businessAddress,
        taxIdentificationNumber: application.taxIdentificationNumber,
        submittedBy: application.submittedBy,
      },
    };

    await this.merchantRiskReviewQueue.add(
      jobName.PROCESS_RISK_REVIEW_JOB,
      jobPayload,
      {
        jobId: application.id,
      },
    );
  }
}

import { InjectRepository } from '@nestjs/typeorm';
import { RiskReviewStatus } from '@app/common';
import { RiskReview } from '@app/typeorm-source';
import { EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { CreateRiskReviewInput } from '@app/common/interface';
import { Injectable } from '@nestjs/common';
import { AssignReviewerDto } from 'apps/merchant-onboarding-platform/src/admin/dto/admin.dto';

@Injectable()
export class RiskReviewsService {
  constructor(
    @InjectRepository(RiskReview)
    private readonly riskReviewRepository: Repository<RiskReview>,
  ) {}

  /**
   * Creates a risk review.
   * Reviewer assignment is handled separately.
   */
  async create(input: CreateRiskReviewInput): Promise<void> {
    await this.riskReviewRepository.insert({
      applicationId: input.applicationId,
      status: input.status ?? RiskReviewStatus.PENDING,
      score: input.score ?? null,
      reason: input.reason ?? null,
      providerReference: input.providerReference ?? null,
      isAutoAnalysisCompleted: input.isAutoAnalysisCompleted ?? false,
      reviewerId: null,
    });
  }

  async assignReviewerAndUpdateStatus(
    data: AssignReviewerDto,
    status: RiskReviewStatus,
    manager: EntityManager,
  ): Promise<void> {
    await manager
      .getRepository(RiskReview)
      .update(
        { applicationId: data.applicationId },
        { reviewerId: data.reviewerId, status },
      );
  }

  async findRiskReviewByApplicationId(
    applicationId: string,
    manager: EntityManager,
  ): Promise<RiskReview | null> {
    return manager.getRepository(RiskReview).findOne({
      where: { applicationId },
      relations: { application: true },
    });
  }

  async getRiskReviewsApplication(
    where: FindOptionsWhere<RiskReview>,
  ): Promise<RiskReview[]> {
    return this.riskReviewRepository.find({
      where,
      relations: {
        application: true,
      },
      select: {
        id: true,
        application: {
          id: true,
          businessName: true,
          legalBusinessName: true,
          businessType: true,
          ownerName: true,
          ownerEmail: true,
          ownerPhone: true,
          requestedProcessingVolume: true,
          status: true,
          requestedTransactionType: true,
          businessRegistrationNumber: true,
          businessWebsite: true,
          businessAddress: true,
          taxIdentificationNumber: true,
          submittedBy: true,
          createdAt: true,
        },
        status: true,
        score: true,
        reason: true,
        providerReference: true,
        isAutoAnalysisCompleted: true,
        createdAt: true,
        updatedAt: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}

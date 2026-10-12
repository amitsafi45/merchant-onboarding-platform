import { InjectRepository } from '@nestjs/typeorm';
import { RiskReviewStatus } from '@app/common';
import { RiskReview } from '@app/typeorm-source';
import { EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import {
  CreateRiskReviewInput,
  PaginatedResponse,
} from '@app/common/interface';
import { Injectable } from '@nestjs/common';
import { AssignReviewerDto } from 'apps/merchant-onboarding-platform/src/admin/dto/admin.dto';
import { PaginationQueryDto } from '@app/common/pagination-query.dto';

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
    paginationQueryDto: PaginationQueryDto,
  ): Promise<PaginatedResponse<RiskReview>> {
    const { page, limit } = paginationQueryDto;

    const [riskReviews, total] = await this.riskReviewRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
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
          updatedAt: true,
        },
        status: true,
        score: true,
        reason: true,
        adminReason: true,
        providerReference: true,
        isAutoAnalysisCompleted: true,
        createdAt: true,
        updatedAt: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
    return {
      data: riskReviews,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOneRiskReview(
    data: AssignReviewerDto,
    manager?: EntityManager,
  ): Promise<RiskReview | null> {
    const repository = manager
      ? manager.getRepository(RiskReview)
      : this.riskReviewRepository;

    return repository.findOneBy({
      applicationId: data.applicationId,
      reviewerId: data.reviewerId,
    });
  }

  async updateRiskReview(
    applicationId: string,
    payload: Partial<RiskReview>,
    manager: EntityManager,
  ): Promise<void> {
    await manager.getRepository(RiskReview).update({ applicationId }, payload);
  }
}

// import { MerchantApplicationService } from '@app/typeorm-source';
import {
  AdminRole,
  ApplicationStatus,
  RiskDecision,
  RiskDecisionAction,
  RiskReviewStatus,
} from '@app/common';
import { AdminAuthPayload } from '@app/guards';
import {
  MerchantApplicationService,
  RiskReviewsService,
} from '@app/typeorm-source';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { RiskDecisionDto } from '../dto/reviewer.dto';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class ReviewerService {
  constructor(
    private readonly merchantApplicationService: MerchantApplicationService,
    private readonly riskReviewsService: RiskReviewsService,
    private readonly dataSource: DataSource,
  ) {}

  async getApplicationsForReview(admin: AdminAuthPayload) {
    const where =
      admin.role === AdminRole.ADMIN ? {} : { reviewerId: admin.sub };

    return this.riskReviewsService.getRiskReviewsApplication(where);
  }

  async performRiskDecision(
    admin: AdminAuthPayload,
    body: RiskDecisionDto,
  ): Promise<void> {
    switch (admin.role) {
      case AdminRole.ADMIN:
        await this.performRiskDecisionBySystemAdmin(admin, body);
        return;

      case AdminRole.REVIEWER:
        await this.performRiskDecisionByAssignedReviewer(admin, body);
        return;

      default:
        throw new ForbiddenException(
          'You are not allowed to perform risk decisions.',
        );
    }
  }

  async performRiskDecisionBySystemAdmin(
    admin: AdminAuthPayload,
    body: RiskDecisionDto,
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const riskReview =
        await this.riskReviewsService.findRiskReviewByApplicationId(
          body.applicationId,
          manager,
        );

      if (!riskReview) {
        throw new HttpException(
          'No risk review found for the specified application.',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.updateRiskDecision(admin, body, manager);
    });
  }

  async performRiskDecisionByAssignedReviewer(
    admin: AdminAuthPayload,
    body: RiskDecisionDto,
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const riskReview = await this.riskReviewsService.findOneRiskReview(
        {
          applicationId: body.applicationId,
          reviewerId: admin.sub,
        },
        manager,
      );

      if (!riskReview) {
        throw new HttpException(
          'No risk review found for this application assigned to you.',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.updateRiskDecision(admin, body, manager);
    });
  }

  private async updateRiskDecision(
    admin: AdminAuthPayload,
    body: RiskDecisionDto,
    manager: EntityManager,
  ): Promise<void> {
    const decisionMap = {
      [RiskDecisionAction.APPROVED]: {
        decision: RiskDecision.PASS,
        applicationStatus: ApplicationStatus.APPROVED,
      },
      [RiskDecisionAction.REJECTED]: {
        decision: RiskDecision.FAIL,
        applicationStatus: ApplicationStatus.REJECTED,
      },
      [RiskDecisionAction.REQUEST_INFORMATION]: {
        decision: RiskDecision.FAIL,
        applicationStatus: ApplicationStatus.REQUEST_INFORMATION,
      },
    };

    const { decision, applicationStatus } = decisionMap[body.action];

    const riskReviewPayload = {
      adminReason: body.reason,
      decision,
      status: RiskReviewStatus.COMPLETED,
      ...(admin.role === AdminRole.ADMIN && {
        reviewerId: admin.sub,
      }),
    };

    const merchantApplicationPayload = {
      status: applicationStatus,
    };

    await this.riskReviewsService.updateRiskReview(
      body.applicationId,
      riskReviewPayload,
      manager,
    );

    await this.merchantApplicationService.updateStatusById(
      merchantApplicationPayload.status,
      body.applicationId,
      manager,
    );
  }
}

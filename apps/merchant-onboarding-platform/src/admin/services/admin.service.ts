import {
  AdminService as AdminEntityService,
  MerchantApplicationService,
  RiskReviewsService,
} from '@app/typeorm-source';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AssignReviewerDto } from '../dto/admin.dto';
import { ApplicationStatus, RiskReviewStatus } from '@app/common';
import { DataSource } from 'typeorm';
import { PaginationQueryDto } from '@app/common/pagination-query.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly merchantApplicationService: MerchantApplicationService,
    private readonly adminService: AdminEntityService,
    private readonly riskReviewsService: RiskReviewsService,
    private readonly dataSource: DataSource,
  ) {}

  async getApplicationsByAdmin(paginationQueryDto: PaginationQueryDto) {
    return this.merchantApplicationService.getApplicationsByAdmin(
      paginationQueryDto,
    );
  }

  async getReviewersByAdmin(paginationQueryDto: PaginationQueryDto) {
    return this.adminService.getReviewersByAdmin(paginationQueryDto);
  }

  /**
   * Assigns a reviewer and updates application statuses transactionally.
   * Risk review: PENDING → PROCESSING
   * Application: SUBMITTED → UNDER_REVIEW
   */
  async assignReviewer(data: AssignReviewerDto): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const riskReview =
        await this.riskReviewsService.findRiskReviewByApplicationId(
          data.applicationId,
          manager,
        );

      const reviewer = await this.adminService.getReviewerById(
        data.reviewerId,
        manager,
      );

      if (!riskReview || !reviewer) {
        throw new HttpException(
          'Application or Reviewer ID does not match',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.riskReviewsService.assignReviewerAndUpdateStatus(
        data,
        RiskReviewStatus.PROCESSING,
        manager,
      );

      await this.merchantApplicationService.updateStatusById(
        ApplicationStatus.UNDER_REVIEW,
        data.applicationId,
        manager,
      );
    });
  }
}

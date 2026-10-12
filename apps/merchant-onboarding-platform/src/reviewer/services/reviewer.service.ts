// import { MerchantApplicationService } from '@app/typeorm-source';
import { AdminRole } from '@app/common';
import { AdminAuthPayload } from '@app/guards';
import { RiskReviewsService } from '@app/typeorm-source';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReviewerService {
  constructor(
    // private readonly merchantApplicationService: MerchantApplicationService,
    private readonly riskReviewsService: RiskReviewsService,
  ) {}
  async getApplicationsForReview(admin: AdminAuthPayload) {
    console.log('Calller', admin);
    const where =
      admin.role === AdminRole.ADMIN ? {} : { reviewerId: admin.sub };

    return this.riskReviewsService.getRiskReviewsApplication(where);
  }
}

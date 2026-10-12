import { Module } from '@nestjs/common';
import { ReviewerController } from '../controllers/reviewer.controller';
import { ReviewerService } from '../services/reviewer.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import {
  MerchantApplication,
  MerchantApplicationService,
  RiskReview,
  RiskReviewsService,
} from '@app/typeorm-source';

@Module({
  imports: [TypeOrmModule.forFeature([MerchantApplication, RiskReview])],
  controllers: [ReviewerController],
  providers: [ReviewerService, MerchantApplicationService, RiskReviewsService],
})
export class ReviewerModule {}

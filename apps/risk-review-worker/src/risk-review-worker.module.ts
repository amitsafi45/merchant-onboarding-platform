import { Module } from '@nestjs/common';
import { RiskReviewWorkerController } from './risk-review-worker.controller';
import { RiskReviewWorkerService } from './risk-review-worker.service';

@Module({
  imports: [],
  controllers: [RiskReviewWorkerController],
  providers: [RiskReviewWorkerService],
})
export class RiskReviewWorkerModule {}

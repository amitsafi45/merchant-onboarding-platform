import { Controller, Get } from '@nestjs/common';
import { RiskReviewWorkerService } from './risk-review-worker.service';

@Controller()
export class RiskReviewWorkerController {
  constructor(private readonly riskReviewWorkerService: RiskReviewWorkerService) {}

  @Get()
  getHello(): string {
    return this.riskReviewWorkerService.getHello();
  }
}

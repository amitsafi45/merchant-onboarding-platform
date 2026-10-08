import { Test, TestingModule } from '@nestjs/testing';
import { RiskReviewWorkerController } from './risk-review-worker.controller';
import { RiskReviewWorkerService } from './risk-review-worker.service';

describe('RiskReviewWorkerController', () => {
  let riskReviewWorkerController: RiskReviewWorkerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RiskReviewWorkerController],
      providers: [RiskReviewWorkerService],
    }).compile();

    riskReviewWorkerController = app.get<RiskReviewWorkerController>(
      RiskReviewWorkerController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(riskReviewWorkerController.getHello()).toBe('Hello World!');
    });
  });
});

import { NestFactory } from '@nestjs/core';
import { RiskReviewWorkerModule } from './risk-review-worker.module';

async function bootstrap() {
  await NestFactory.createApplicationContext(RiskReviewWorkerModule);
}
bootstrap();

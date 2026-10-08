import { NestFactory } from '@nestjs/core';
import { RiskReviewWorkerModule } from './risk-review-worker.module';

async function bootstrap() {
  const app = await NestFactory.create(RiskReviewWorkerModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();

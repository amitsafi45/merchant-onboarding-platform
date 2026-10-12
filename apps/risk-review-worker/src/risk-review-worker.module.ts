import { Module } from '@nestjs/common';
import { RiskReviewWorkerService } from './risk-review-worker.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { QueueNameConfig } from '@app/queue-contracts';
import {
  MerchantApplication,
  MerchantApplicationService,
  RiskReview,
  RiskReviewsService,
  TypeormSourceModule,
} from '@app/typeorm-source';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeormSourceModule,
    TypeOrmModule.forFeature([RiskReview, MerchantApplication]),
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.registerQueueAsync({
      name: QueueNameConfig.MERCHANT_RISK_REVIEW_QUEUE,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST'),
          port: config.get<number>('REDIS_PORT'),
          maxRetriesPerRequest: null,
        },
      }),
    }),
  ],
  providers: [
    RiskReviewWorkerService,
    RiskReviewsService,
    MerchantApplicationService,
  ],
})
export class RiskReviewWorkerModule {}

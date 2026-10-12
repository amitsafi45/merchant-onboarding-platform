import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';

import { ListenerEventService } from '../services/listener.service';
import { QueueNameConfig } from '@app/queue-contracts';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: QueueNameConfig.MERCHANT_RISK_REVIEW_QUEUE,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST'),
          port: config.get<number>('REDIS_PORT'),
          maxRetriesPerRequest: null,
        },
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
          removeOnComplete: true,
          removeOnFail: false,
        },
      }),
    }),
  ],
  providers: [ListenerEventService],
  exports: [BullModule],
})
export class ProducerQueueModule {}

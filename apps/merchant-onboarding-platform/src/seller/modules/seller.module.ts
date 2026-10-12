import { Module } from '@nestjs/common';
import { SellerController } from '../controllers/seller.controller';
import { SellerService } from '../services/seller.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProducerQueueModule } from '../../producer-listener';
import {
  MerchantApplication,
  MerchantApplicationService,
} from '@app/typeorm-source';

@Module({
  imports: [
    TypeOrmModule.forFeature([MerchantApplication]),
    ProducerQueueModule,
  ],
  controllers: [SellerController],
  providers: [SellerService, MerchantApplicationService],
})
export class SellerModule {}

import { Module } from '@nestjs/common';
import { AdminController } from '../controllers/admin.controller';
import { AdminService } from '../services/admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantApplication } from '@app/typeorm-source/entities/merchant-application.entity';
import {
  Admin,
  MerchantApplicationService,
  AdminService as AdminEntityService,
  RiskReviewsService,
  RiskReview,
} from '@app/typeorm-source';
@Module({
  imports: [TypeOrmModule.forFeature([MerchantApplication, Admin, RiskReview])],
  controllers: [AdminController],
  providers: [
    AdminService,
    MerchantApplicationService,
    AdminEntityService,
    RiskReviewsService,
  ],
})
export class AdminModule {}

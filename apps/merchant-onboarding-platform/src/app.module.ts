import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ProducerQueueModule } from './producer-listener';
import { AuthModule } from './auth/modules/auth.module';
import { GuardsModule } from '@app/guards';
import { JwtModule } from '@nestjs/jwt';
import { SellerModule } from './seller/modules/seller.module';
import { AdminModule } from './admin/modules/admin.module';
import { ReviewerModule } from './reviewer/modules/reviewer.module';
import { TypeormSourceModule } from '@app/typeorm-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
    }),
    TypeormSourceModule,
    ProducerQueueModule,
    AuthModule,
    GuardsModule,
    AdminModule,
    ReviewerModule,
    SellerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

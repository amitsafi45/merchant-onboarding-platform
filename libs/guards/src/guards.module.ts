import { Module } from '@nestjs/common';
import {
  SellerAuthentication,
  AdminAuthentication,
  AdminAuthorization,
} from '@app/guards';

@Module({
  providers: [SellerAuthentication, AdminAuthentication, AdminAuthorization],
  exports: [SellerAuthentication, AdminAuthentication, AdminAuthorization],
})
export class GuardsModule {}

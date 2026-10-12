import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import {
  Admin,
  AdminService,
  AdminToken,
  AdminTokenService,
  User,
  UserService,
  UserToken,
  UserTokenService,
} from '@app/typeorm-source';

@Module({
  imports: [TypeOrmModule.forFeature([User, Admin, AdminToken, UserToken])],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    UserTokenService,
    AdminService,
    AdminTokenService,
  ],
})
export class AuthModule {}

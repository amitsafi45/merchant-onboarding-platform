import 'reflect-metadata';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Admin,
  AdminToken,
  MerchantApplication,
  RiskReview,
  User,
  UserToken,
} from '@app/typeorm-source';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        entities: [
          User,
          MerchantApplication,
          RiskReview,
          Admin,
          UserToken,
          AdminToken,
        ],
        host: configService.getOrThrow<string>('DATABASE_HOST'),
        port: configService.getOrThrow<number>('DATABASE_PORT'),
        username: configService.getOrThrow<string>('DATABASE_USERNAME'),
        password: configService.getOrThrow<string>('DATABASE_PASSWORD'),
        database: configService.getOrThrow<string>('DATABASE_NAME'),
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class TypeormSourceModule {}

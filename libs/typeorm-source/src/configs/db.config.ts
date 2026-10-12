import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as path from 'node:path';
import {
  Admin,
  AdminToken,
  MerchantApplication,
  RiskReview,
  User,
  UserToken,
} from '@app/typeorm-source';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [
    User,
    MerchantApplication,
    RiskReview,
    Admin,
    UserToken,
    AdminToken,
  ],
  migrations: [
    path.join(process.cwd(), 'libs/typeorm-source/src/migrations/*.ts'),
  ],
  synchronize: false,
});

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumn1791820378251 implements MigrationInterface {
  name = 'AddColumn1791820378251';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "risk_reviews" ADD "admin_reason" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "risk_reviews" ADD "is_auto_analysis_completed" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "risk_reviews" DROP COLUMN "is_auto_analysis_completed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "risk_reviews" DROP COLUMN "admin_reason"`,
    );
  }
}

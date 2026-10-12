import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveEnumValue1791824362799 implements MigrationInterface {
    name = 'RemoveEnumValue1791824362799'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."risk_reviews_status_enum" RENAME TO "risk_reviews_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."risk_reviews_status_enum" AS ENUM('PENDING', 'PROCESSING', 'COMPLETED')`);
        await queryRunner.query(`ALTER TABLE "risk_reviews" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "risk_reviews" ALTER COLUMN "status" TYPE "public"."risk_reviews_status_enum" USING "status"::"text"::"public"."risk_reviews_status_enum"`);
        await queryRunner.query(`ALTER TABLE "risk_reviews" ALTER COLUMN "status" SET DEFAULT 'PENDING'`);
        await queryRunner.query(`DROP TYPE "public"."risk_reviews_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."risk_reviews_status_enum_old" AS ENUM('PENDING', 'PROCESSING', 'REQUEST_INFORMATION', 'COMPLETED')`);
        await queryRunner.query(`ALTER TABLE "risk_reviews" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "risk_reviews" ALTER COLUMN "status" TYPE "public"."risk_reviews_status_enum_old" USING "status"::"text"::"public"."risk_reviews_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "risk_reviews" ALTER COLUMN "status" SET DEFAULT 'PENDING'`);
        await queryRunner.query(`DROP TYPE "public"."risk_reviews_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."risk_reviews_status_enum_old" RENAME TO "risk_reviews_status_enum"`);
    }

}

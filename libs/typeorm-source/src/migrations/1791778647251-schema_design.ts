import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaDesign1791778647251 implements MigrationInterface {
  name = 'SchemaDesign1791778647251';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" text NOT NULL, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, CONSTRAINT "UQ_4e993847043f5bf10656b917985" UNIQUE ("token"), CONSTRAINT "PK_63764db9d9aaa4af33e07b2f4bf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9e144a67be49e5bba91195ef5d" ON "user_tokens" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "name" character varying(100) NOT NULL, "password" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."merchant_applications_status_enum" AS ENUM('DRAFT', 'SUBMITTED', 'REQUEST_INFORMATION', 'UNDER_REVIEW', 'APPROVED', 'REJECTED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."merchant_applications_requested_transaction_type_enum" AS ENUM('CARD_PAYMENT', 'BANK_TRANSFER', 'DIGITAL_WALLET')`,
    );
    await queryRunner.query(
      `CREATE TABLE "merchant_applications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "business_name" character varying NOT NULL, "legal_business_name" character varying NOT NULL, "business_type" character varying NOT NULL, "owner_name" character varying NOT NULL, "owner_email" character varying NOT NULL, "owner_phone" character varying NOT NULL, "requested_processing_volume" numeric(15,2) NOT NULL, "status" "public"."merchant_applications_status_enum" NOT NULL DEFAULT 'DRAFT', "requested_transaction_type" "public"."merchant_applications_requested_transaction_type_enum" NOT NULL, "business_registration_number" character varying, "business_website" character varying, "business_address" text, "tax_identification_number" character varying, "submitted_by" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_09b9df0877db73b8a232c8c7ed4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a992addbc0cc5678f3608e1e92" ON "merchant_applications" ("submitted_by") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."risk_reviews_status_enum" AS ENUM('PENDING', 'PROCESSING', 'REQUEST_INFORMATION', 'COMPLETED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."risk_reviews_decision_enum" AS ENUM('PASS', 'FAIL')`,
    );
    await queryRunner.query(
      `CREATE TABLE "risk_reviews" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."risk_reviews_status_enum" NOT NULL DEFAULT 'PENDING', "decision" "public"."risk_reviews_decision_enum", "score" integer, "reason" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "application_id" uuid NOT NULL, "reviewer_id" uuid, "provider_reference" character varying(255), CONSTRAINT "UQ_01e7bad3dad96afda5d9631f8d9" UNIQUE ("application_id"), CONSTRAINT "REL_01e7bad3dad96afda5d9631f8d" UNIQUE ("application_id"), CONSTRAINT "PK_32e1cd29b2ee1ca11018f2e525c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."admin_role_enum" AS ENUM('ADMIN', 'REVIEWER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "admin" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, "password" character varying NOT NULL, "role" "public"."admin_role_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_de87485f6489f5d0995f5841952" UNIQUE ("email"), CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "admin_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" text NOT NULL, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "admin_id" uuid NOT NULL, CONSTRAINT "UQ_8a45fc9ecc8373746567c65d4c0" UNIQUE ("token"), CONSTRAINT "PK_1b8fe3dbc19bbe91baa16ab6b09" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0100ae59427b54256aabd9f068" ON "admin_tokens" ("admin_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "user_tokens" ADD CONSTRAINT "FK_9e144a67be49e5bba91195ef5de" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "merchant_applications" ADD CONSTRAINT "FK_a992addbc0cc5678f3608e1e92e" FOREIGN KEY ("submitted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "risk_reviews" ADD CONSTRAINT "FK_01e7bad3dad96afda5d9631f8d9" FOREIGN KEY ("application_id") REFERENCES "merchant_applications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "risk_reviews" ADD CONSTRAINT "FK_b7dd57d2d03b7e85e9877cb233f" FOREIGN KEY ("reviewer_id") REFERENCES "admin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_tokens" ADD CONSTRAINT "FK_0100ae59427b54256aabd9f0689" FOREIGN KEY ("admin_id") REFERENCES "admin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admin_tokens" DROP CONSTRAINT "FK_0100ae59427b54256aabd9f0689"`,
    );
    await queryRunner.query(
      `ALTER TABLE "risk_reviews" DROP CONSTRAINT "FK_b7dd57d2d03b7e85e9877cb233f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "risk_reviews" DROP CONSTRAINT "FK_01e7bad3dad96afda5d9631f8d9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "merchant_applications" DROP CONSTRAINT "FK_a992addbc0cc5678f3608e1e92e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_tokens" DROP CONSTRAINT "FK_9e144a67be49e5bba91195ef5de"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0100ae59427b54256aabd9f068"`,
    );
    await queryRunner.query(`DROP TABLE "admin_tokens"`);
    await queryRunner.query(`DROP TABLE "admin"`);
    await queryRunner.query(`DROP TYPE "public"."admin_role_enum"`);
    await queryRunner.query(`DROP TABLE "risk_reviews"`);
    await queryRunner.query(`DROP TYPE "public"."risk_reviews_decision_enum"`);
    await queryRunner.query(`DROP TYPE "public"."risk_reviews_status_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a992addbc0cc5678f3608e1e92"`,
    );
    await queryRunner.query(`DROP TABLE "merchant_applications"`);
    await queryRunner.query(
      `DROP TYPE "public"."merchant_applications_requested_transaction_type_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."merchant_applications_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9e144a67be49e5bba91195ef5d"`,
    );
    await queryRunner.query(`DROP TABLE "user_tokens"`);
  }
}

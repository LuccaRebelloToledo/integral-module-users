import { MigrationInterface, QueryRunner } from 'typeorm';

export class Default1706799432839 implements MigrationInterface {
  name = 'Default1706799432839';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "feature_groups" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "feature_groups" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "feature_groups" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "feature_groups" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "features" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "features" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "features" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "features" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "features" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "features" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "features" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "features" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "feature_groups" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "feature_groups" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "feature_groups" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "feature_groups" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
  }
}

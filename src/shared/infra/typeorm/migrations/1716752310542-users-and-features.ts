import type { MigrationInterface, QueryRunner } from 'typeorm';

export class UsersAndFeatures1716752310542 implements MigrationInterface {
  name = 'UsersAndFeatures1716752310542';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" character varying(21) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, "password" character varying NOT NULL, "feature_group_id" character varying(21) NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "feature_groups" ("id" character varying(21) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "key" character varying(50) NOT NULL, "name" character varying(50) NOT NULL, CONSTRAINT "UQ_2a30a8af474dcef836abe567df9" UNIQUE ("key"), CONSTRAINT "UQ_f144e4f34cc0b1cf5aec0b2b857" UNIQUE ("name"), CONSTRAINT "PK_fccccc087ddae8137824b8a5368" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "features" ("id" character varying(21) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "key" character varying(50) NOT NULL, "name" character varying(50) NOT NULL, CONSTRAINT "UQ_0cc5c687428b94489ce1edc3c5a" UNIQUE ("key"), CONSTRAINT "UQ_bcc3a344ae156a9fba128e1cb4d" UNIQUE ("name"), CONSTRAINT "PK_5c1e336df2f4a7051e5bf08a941" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "grouped_features" ("feature_group_id" character varying(21) NOT NULL, "feature_id" character varying(21) NOT NULL, CONSTRAINT "PK_49c40ce5118503026609f59e9cb" PRIMARY KEY ("feature_group_id", "feature_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f75a08b00c02b82fc0708e71aa" ON "grouped_features" ("feature_group_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a4f94420409474b3379b00ae4c" ON "grouped_features" ("feature_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_a757a79bd3f802a3dcaac739c2a" FOREIGN KEY ("feature_group_id") REFERENCES "feature_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "grouped_features" ADD CONSTRAINT "FK_f75a08b00c02b82fc0708e71aa0" FOREIGN KEY ("feature_group_id") REFERENCES "feature_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "grouped_features" ADD CONSTRAINT "FK_a4f94420409474b3379b00ae4c5" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "grouped_features" DROP CONSTRAINT "FK_a4f94420409474b3379b00ae4c5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "grouped_features" DROP CONSTRAINT "FK_f75a08b00c02b82fc0708e71aa0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_a757a79bd3f802a3dcaac739c2a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a4f94420409474b3379b00ae4c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f75a08b00c02b82fc0708e71aa"`,
    );
    await queryRunner.query(`DROP TABLE "grouped_features"`);
    await queryRunner.query(`DROP TABLE "features"`);
    await queryRunner.query(`DROP TABLE "feature_groups"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}

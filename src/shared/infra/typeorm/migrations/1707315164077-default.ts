import { MigrationInterface, QueryRunner } from 'typeorm';

export class Default1707315164077 implements MigrationInterface {
  name = 'Default1707315164077';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "features" ("id" character varying(21) NOT NULL, "key" character varying(50) NOT NULL, "name" character varying(50) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_0cc5c687428b94489ce1edc3c5a" UNIQUE ("key"), CONSTRAINT "UQ_bcc3a344ae156a9fba128e1cb4d" UNIQUE ("name"), CONSTRAINT "PK_5c1e336df2f4a7051e5bf08a941" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "feature_groups" ("id" character varying(21) NOT NULL, "key" character varying(50) NOT NULL, "name" character varying(50) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2a30a8af474dcef836abe567df9" UNIQUE ("key"), CONSTRAINT "UQ_f144e4f34cc0b1cf5aec0b2b857" UNIQUE ("name"), CONSTRAINT "PK_fccccc087ddae8137824b8a5368" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" character varying(21) NOT NULL, "name" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, "password" character varying NOT NULL, "featureGroupId" character varying(21) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_features" ("featureId" character varying(21) NOT NULL, "userId" character varying(21) NOT NULL, CONSTRAINT "PK_25cc6a04bb8aa111d7cd5163aaf" PRIMARY KEY ("featureId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0be9140498271b37ba8e849b2a" ON "user_features" ("featureId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_eb08b1dc96391576468302115d" ON "user_features" ("userId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "grouped_features" ("featureGroupId" character varying(21) NOT NULL, "featureId" character varying(21) NOT NULL, CONSTRAINT "PK_ce7f428a124427b673601144e91" PRIMARY KEY ("featureGroupId", "featureId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c55f366bf549eddd4e7e597970" ON "grouped_features" ("featureGroupId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c243f546b4d4fd5dcca31d02ad" ON "grouped_features" ("featureId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_255e083873b0dceac012ea9fc22" FOREIGN KEY ("featureGroupId") REFERENCES "feature_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_features" ADD CONSTRAINT "FK_0be9140498271b37ba8e849b2ae" FOREIGN KEY ("featureId") REFERENCES "features"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_features" ADD CONSTRAINT "FK_eb08b1dc96391576468302115d0" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "grouped_features" ADD CONSTRAINT "FK_c55f366bf549eddd4e7e597970f" FOREIGN KEY ("featureGroupId") REFERENCES "feature_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "grouped_features" ADD CONSTRAINT "FK_c243f546b4d4fd5dcca31d02ade" FOREIGN KEY ("featureId") REFERENCES "features"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "grouped_features" DROP CONSTRAINT "FK_c243f546b4d4fd5dcca31d02ade"`,
    );
    await queryRunner.query(
      `ALTER TABLE "grouped_features" DROP CONSTRAINT "FK_c55f366bf549eddd4e7e597970f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_features" DROP CONSTRAINT "FK_eb08b1dc96391576468302115d0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_features" DROP CONSTRAINT "FK_0be9140498271b37ba8e849b2ae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_255e083873b0dceac012ea9fc22"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c243f546b4d4fd5dcca31d02ad"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c55f366bf549eddd4e7e597970"`,
    );
    await queryRunner.query(`DROP TABLE "grouped_features"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_eb08b1dc96391576468302115d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0be9140498271b37ba8e849b2a"`,
    );
    await queryRunner.query(`DROP TABLE "user_features"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "feature_groups"`);
    await queryRunner.query(`DROP TABLE "features"`);
  }
}

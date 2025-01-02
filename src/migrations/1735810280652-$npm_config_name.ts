import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1735810280652 implements MigrationInterface {
    name = ' $npmConfigName1735810280652'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c83cfee225e68762436f5061a8" ON "bucket_list" ("name", "userId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_c83cfee225e68762436f5061a8"`);
    }

}

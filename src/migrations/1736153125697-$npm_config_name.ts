import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1736153125697 implements MigrationInterface {
    name = ' $npmConfigName1736153125697'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "idx_destination_description" ON "destination" ("description") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."idx_destination_description"`);
    }

}

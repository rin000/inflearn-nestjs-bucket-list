import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1735554868632 implements MigrationInterface {
    name = ' $npmConfigName1735554868632'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "name" character varying(255) NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
    }

}

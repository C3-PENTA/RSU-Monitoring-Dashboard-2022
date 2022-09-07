import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createTableEvent1653403129300 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'event',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isNullable: false,
            generationStrategy: 'uuid',
            default: `uuid_generate_v4()`,
          },
          {
            name: 'category',
            isNullable: false,
            type: 'int',
          },
          {
            name: 'sendNodeType',
            isNullable: false,
            type: 'varchar',
          },
          {
            name: 'sendNode',
            isNullable: false,
            type: 'varchar',
          },
          {
            name: 'receiveNodeType',
            type: 'varchar',
            default: `''`,
          },
          {
            name: 'receiveNode',
            type: 'varchar',
            default: `''`,
          },
          {
            name: 'detectionNodeType',
            type: 'varchar',
            default: `''`,
          },
          {
            name: 'detectionNode',
            type: 'varchar',
            default: `''`,
          },
          {
            name: 'eventType',
            type: 'varchar',
            default: `''`,
          },
          {
            name: 'status',
            type: 'varchar',
            default: `''`,
          },
          {
            name: 'request',
            type: 'varchar',
            default: `''`,
          },
          {
            name: 'action',
            type: 'varchar',
            default: `''`,
          },
          {
            name: 'eventInfo',
            type: 'jsonb',
            default: `'{}'::jsonb`,
          },
          {
            name: 'createdAt',
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamptz',
            default: 'now()',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('event');
  }
}

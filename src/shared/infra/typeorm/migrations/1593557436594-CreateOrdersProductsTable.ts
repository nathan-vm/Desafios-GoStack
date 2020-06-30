import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export default class CreateOrdersProductsTable1593557436594
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'orders_products',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'order_id',
            type: 'uuid',
          },
          {
            name: 'product_id',
            type: 'uuid',
          },
          {
            name: 'quantity',
            type: 'integer',
          },
          {
            name: 'price',
            type: 'DECIMAL(20, 2)',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'orders_products_order',
            referencedTableName: 'orders',
            referencedColumnNames: ['id'],
            columnNames: ['order_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'orders_products_product',
            referencedTableName: 'products',
            referencedColumnNames: ['id'],
            columnNames: ['product_id'],
            onDelete: 'SET NULL',
            onUpdate: 'NO ACTION',
          },
        ],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('orders_products')
  }
}

import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddBrandColumn1728479400000 implements MigrationInterface {
    name = 'AddBrandColumn1728479400000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if column exists before adding it
        const table = await queryRunner.getTable('product');
        const brandColumn = table?.findColumnByName('brand');
        
        if (!brandColumn) {
            await queryRunner.addColumn('product', new TableColumn({
                name: 'brand',
                type: 'varchar',
                isNullable: true,
                comment: 'Product brand name'
            }));
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('product');
        const brandColumn = table?.findColumnByName('brand');
        
        if (brandColumn) {
            await queryRunner.dropColumn('product', 'brand');
        }
    }
}

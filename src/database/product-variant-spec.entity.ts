import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
// Removed circular import - using string reference instead


@Entity('product_variant_spec')
export class ProductVariantSpec {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column()
  value: string;

  @ManyToOne('ProductVariant', (variant: any) => variant.specs, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  productVariant?: any;

  @Column({ nullable: true })
  productVariantId?: number;
}

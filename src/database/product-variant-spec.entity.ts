import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ProductVariant } from './Product-variant.entity';


@Entity('product_variant_spec')
export class ProductVariantSpec {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column()
  value: string;

  @ManyToOne(() => ProductVariant, (variant) => variant.specs, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  productVariant?: ProductVariant;

  @Column({ nullable: true })
  productVariantId?: number;
}

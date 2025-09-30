import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { ProductVariantSpec } from './product-variant-spec.entity';
import { ProductEntity } from './Product.entity';


@Entity('product_variant')
export class ProductVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  stock: number;

  @Column('decimal')
  price: number;

  @Column({ default: 0 })
  discount: number;

  @Column()
  slug: string;

  @Column("text", { array: true })
  images: string[];

  @OneToMany(() => ProductVariantSpec, (spec) => spec.productVariant, {
    cascade: true,
  })
  specs: ProductVariantSpec[];

  @ManyToOne(() => ProductEntity, (product) => product.variants, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  product?: ProductEntity;

  @Column({ nullable: true })
  productId?: number;
}

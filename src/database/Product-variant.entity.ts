import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
// Removed circular import - using string reference instead
// Removed circular import - using string reference instead


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

  @OneToMany('ProductVariantSpec', (spec: any) => spec.productVariant, {
    cascade: true,
  })
  specs: any[];

  @ManyToOne('ProductEntity', (product: any) => product.variants, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  product?: any;

  @Column({ nullable: true })
  productId?: number;
}

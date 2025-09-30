import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { ProductEntity } from './Product.entity';
// Removed circular import - using string reference instead

@Entity('product_spec')
export class ProductSpec {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column()
  name: string;

  @ManyToOne(() => ProductEntity, (product) => product.specs, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  product: ProductEntity;

  @Column({ nullable: true })
  productId: number;

  @OneToMany('ProductSpecValue', (value: any) => value.productSpec, {
    cascade: true,
    eager: true,
  })
  values: any[];
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { ProductEntity } from './Product.entity';
import { ProductSpecValue } from './Product-spec-value.entity';

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

  @OneToMany(() => ProductSpecValue, (value) => value.productSpec, {
    cascade: true,
    eager: true,
  })
  values: ProductSpecValue[];
}

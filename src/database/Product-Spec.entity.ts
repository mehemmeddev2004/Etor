import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';
// Removed circular import - using string reference instead
// Removed circular import - using string reference instead

@Entity('product_spec')
export class ProductSpec {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column()
  name: string;

  @ManyToOne('ProductEntity', (product: any) => product.specs, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  product: any;

  @Column({ nullable: true })
  productId: number;

  @OneToMany('ProductSpecValue', (value: any) => value.productSpec, {
    cascade: true,
    eager: true,
  })
  values: any[];
}

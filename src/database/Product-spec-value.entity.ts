import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ProductSpec } from './Product-Spec.entity';


@Entity('product_spec_value')
export class ProductSpecValue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column()
  value: string;

  @ManyToOne(() => ProductSpec, (spec) => spec.values, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  productSpec?: ProductSpec;

  @Column({ nullable: true })
  productSpecId?: number;
}

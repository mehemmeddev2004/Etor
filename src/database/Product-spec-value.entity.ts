import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
// Removed circular import - using string reference instead


@Entity('product_spec_value')
export class ProductSpecValue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column()
  value: string;

  @ManyToOne('ProductSpec', (spec: any) => spec.values, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  productSpec?: any;

  @Column({ nullable: true })
  productSpecId?: number;
}

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';

import { userEntity } from './user.entity';
import { CategoryEntity } from './Category.entity';
import { ProductSpec } from './Product-Spec.entity';
import { ProductVariant } from './Product-variant.entity';
import { PaymentEntity } from './Payment.entity';
import { NewSeasonEntity } from './NewSeason.entity';

@Entity('product')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column()
  name: string;

 @Column("text", { array: true, nullable: true })
description?: string[];


  @Column({ nullable: true })
  img?: string;

  @Column("text", { array: true, nullable: true })
  images?: string[];

  @Column("text", { array: true, nullable: true })
  imagePublicIds?: string[];

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  stock: number;

  @OneToOne(() => NewSeasonEntity, (newSeason) => newSeason.product, {
  cascade: true,
  nullable: true,
  })
  @JoinColumn()
  newSeason?: NewSeasonEntity;


  @ManyToOne(() => CategoryEntity, category => category.products, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  category?: CategoryEntity;
  
   @OneToMany(() => PaymentEntity, payment => payment.product)
  payments: PaymentEntity[];

  @ManyToOne(() => userEntity, user => user.products, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  user?: userEntity;

  @OneToMany(() => ProductSpec, (spec) => spec.product, {
    cascade: true,
    eager: true,
  })
  specs: ProductSpec[];

  @OneToMany(() => ProductVariant, variant => variant.product, {
    cascade: true,
    eager: true,
  })
  variants: ProductVariant[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

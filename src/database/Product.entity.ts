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

// Removed all circular imports - using string references instead

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

  @Column({ nullable: true })
  brand?: string;

  

  
  @Column({ default: 0 })
  stock: number;

  @OneToOne('NewSeasonEntity', (newSeason: any) => newSeason.product, {
  cascade: true,
  nullable: true,
  })
  @JoinColumn()
  newSeason?: any;


  @ManyToOne('CategoryEntity', (category: any) => category.products, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  category?: any;
  
   @OneToMany('PaymentEntity', (payment: any) => payment.product)
  payments: any[];

  @ManyToOne('userEntity', (user: any) => user.products, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  user?: any;

  @OneToMany('ProductSpec', (spec: any) => spec.product, {
    cascade: true,
    eager: true,
  })
  specs: any[];

  @OneToMany('ProductVariant', (variant: any) => variant.product, {
    cascade: true,
    eager: true,
  })
  variants: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

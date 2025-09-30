import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { userEntity } from "./user.entity";
import { ProductEntity } from "./Product.entity";

@Entity('payments')
export class PaymentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column()
  currency: string;

  @Column()
  stripePaymentIntentId: string;

  @Column({ default: false })
  paid: boolean;


  @ManyToOne(() => userEntity, user => user.payments) 
  user: userEntity;

  @OneToMany(() => ProductEntity, product => product.payments)
  product: ProductEntity

  @CreateDateColumn()
  createdAt: Date;

}

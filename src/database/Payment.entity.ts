import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany } from "typeorm";
// Removed circular imports - using string references instead

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


  @ManyToOne('userEntity', (user: any) => user.payments) 
  user: any;

  @OneToMany('ProductEntity', (product: any) => product.payments)
  product: any

  @CreateDateColumn()
  createdAt: Date;

}

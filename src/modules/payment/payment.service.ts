import { Injectable } from "@nestjs/common";
import Stripe from "stripe";
import { ConfigService } from "@nestjs/config";
import { PaymentDto } from "./Dto/create-payment.dto";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { ClsService } from "nestjs-cls";


@Injectable()
export class PaymentsService { 
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    @InjectDataSource() private dataSource: DataSource,
    private cls: ClsService, // CLS inject et
  ) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('Stripe secret key is not configured');
    }

    this.stripe = new Stripe(stripeSecretKey, {
       apiVersion: '2022-11-15' as any,
    });
  }

  // Stripe ödənişi yaratmaq və DB save
  async createPaymentIntent(paymentDto: PaymentDto) {
    const user = this.cls.get('user');
    if (!user) throw new Error('Unauthorized');

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: paymentDto.amount,
      currency: paymentDto.currency,
      metadata: { 
        productId: paymentDto.productId.toString(),
        userId: user.id.toString(),
      },
    });

    // DB save
    await this.dataSource.query(
      `INSERT INTO payments (amount, currency, stripePaymentIntentId, paid, createdAt, productId, userId)
       VALUES (?, ?, ?, false, NOW(), ?, ?)`,
      [paymentDto.amount, paymentDto.currency, paymentIntent.id, paymentDto.productId, user.id]
    );

    return paymentIntent;
  }

  // DB-dən bütün ödənişləri gətirmək
  async findAllPayments() {
    const payments = await this.dataSource.query('SELECT * FROM payments');
    return payments;
  }
}

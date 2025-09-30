import { Controller, Post, Body, Get } from "@nestjs/common";
import { PaymentsService } from "./payment.service";
import { PaymentDto } from "./Dto/create-payment.dto";

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentService: PaymentsService) {}

@Post('create')
async createPayment(@Body() paymentDto: PaymentDto) {
  if (!paymentDto.amount || !paymentDto.currency || !paymentDto.productId) {
    return { error: 'Amount, currency and productId are required' };
  }

  const paymentIntent = await this.paymentService.createPaymentIntent(paymentDto);
  return { clientSecret: paymentIntent.client_secret };
}


  // Yeni endpoint: bütün ödənişləri gətir
  @Get()
  async findAllPayments() {
    const payments = await this.paymentService.findAllPayments();
    return payments;
  }
}

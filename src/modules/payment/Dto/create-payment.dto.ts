import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsString, Min } from "class-validator";

export class PaymentDto {
  @ApiProperty({ description: 'Ödəniş məbləği cents-də' })
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  amount: number;

  @ApiProperty({ description: 'Valyuta kodu, məsələn usd' })
  @IsString()
  currency: string;

    @ApiProperty({ description: 'Məhsulun ID-si' })
  @IsNumber()
  productId: number;
}

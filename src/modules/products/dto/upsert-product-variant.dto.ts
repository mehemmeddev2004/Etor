import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class UpsertProductVariantSpecDto {
  @Type()
  @IsString()
  @MinLength(1)
  @ApiProperty({ default: 'color' })
  key: string;

  @Type()
  @IsString()
  @MinLength(1)
  @ApiProperty({ default: 'orange' })
  value: string;
}

export class UpsertProductVariantDto {
  @Type()
  @IsInt()
  @Min(0)
  @IsOptional()
  @ApiProperty({ default: 0 })
  stock: number;

  @Type()
  @IsString()
  @MinLength(3)
  @ApiProperty({ default: '' })
  slug: string;

  @Type()
  @IsInt()
  @Min(1)
  @ApiProperty({ default: 1 })
  price: number;

  @Type()
  @IsInt()
  @Min(0)
  @IsOptional()
  @ApiProperty({ default: 0 })
  discount: number;

  @Type()
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  @ApiProperty({ default: [] })
  images: string[];

  @Type(() => UpsertProductVariantSpecDto)
  @IsArray()
  @ValidateNested({ each: true })
  @ApiProperty({ type: UpsertProductVariantSpecDto, isArray: true })
  specs: UpsertProductVariantSpecDto[];
}
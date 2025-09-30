import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class FilterCategoryDto {
  @Type()
  @IsString()
  @ApiProperty({ required: false })
  @IsOptional()
  name?: string;

  @Type()
  @IsString()
  @ApiProperty({ required: false })
  @IsOptional()
  slug?: string;

  @Type()
  @IsNumber()
  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  parentId?: number;
}
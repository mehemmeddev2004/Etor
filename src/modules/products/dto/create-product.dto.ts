import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsString, MinLength, Min, IsArray, ValidateNested } from "class-validator";


export class CreateProductSpecValueDto {
  @Type()
  @IsString()
  @MinLength(1)
  @ApiProperty({ default: 'orange' })
  key: string;

  @Type()
  @IsString()
  @MinLength(1)
  @ApiProperty({ default: 'Orange' })
  value: string;
}

export class CreateProductSpecDto {
  @Type()
  @IsString()
  @MinLength(3)
  @ApiProperty({ default: 'color' })
  key: string;

  @Type()
  @IsString()
  @MinLength(3)
  @ApiProperty({ default: 'Color' })
  name: string;

  @Type(() => CreateProductSpecValueDto)
  @IsArray()
  @ValidateNested({ each: true })
  @ApiProperty({ type: CreateProductSpecValueDto, isArray: true })
  values: CreateProductSpecValueDto[];
}



export class CreateProductDto {
    @Type(() => String)
    @IsString()
    @ApiProperty()
    @MinLength(3)
    name: string;

    @Type(() => String)
    @IsString()
    @ApiProperty()
    @MinLength(3)
    slug: string;

    @Type(() => Array)
    @IsArray()
    @ApiProperty()
    description: string[];

    @Type(() => String)
    @IsString()
    @ApiProperty()
    @MinLength(3)
    img: string;

    @Type(() => Number)
    @IsInt()
    @Min(0)
    @ApiProperty()
    price: number;

    @Type(() => Number)
    @IsInt()
    @Min(0)
    @ApiProperty()
    stock: number;
}

import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsString, MinLength, Min, IsArray } from "class-validator";

export class UpdateProductDto {
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
    @MinLength(3)
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

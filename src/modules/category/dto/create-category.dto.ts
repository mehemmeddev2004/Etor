import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
    @Type()
    @IsString()
    @ApiProperty()
    name: string

    @Type()
    @IsString()
    @ApiProperty()
    slug: string

    @Type()
    @ApiProperty({ example: 'https://res.cloudinary.com/.../image.jpg' })
    @IsString()
    imageUrl: string;



    @Type(() => Number)
    @ApiProperty({ example: 1, required: false })
    @IsOptional()
    @IsNumber()
    parentId?: number;
}
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateProfileDto{
    @Type()
    @IsString()
    @ApiProperty()
    @MinLength(3)
    @MaxLength(20)
    name: string

    @Type()
    @IsString()
    @ApiProperty()
    @MinLength(3)
    img: string


}
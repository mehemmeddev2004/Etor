import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";

export class AuthloginDto {
    @Type()
    @IsString()
    @ApiProperty()
    @MinLength(3)
    password:string


    @Type()
    @IsEmail()
    @ApiProperty()
    @MinLength(3)
    email: string
}
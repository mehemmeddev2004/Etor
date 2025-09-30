import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";

export class AuthRegisterDto {
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

    @Type()
    @IsString()
    @ApiProperty()
    @MinLength(3)
    username:string

  @Type()
@IsString()
@ApiProperty()
@MinLength(3)
role: string;



}
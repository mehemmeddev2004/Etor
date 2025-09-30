import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsUUID, Length, MinLength } from 'class-validator';

export class ConfirmForgetPaswordDto {
  @Type()
  @IsString()
  @ApiProperty()
  @IsUUID()
  token: string;

  @Type()
  @IsString()
  @ApiProperty()
  @MinLength(6)
  newPassword: string;

  @Type()
  @IsString()
  @ApiProperty()
  @MinLength(6)
  repeatPassword: string;
}
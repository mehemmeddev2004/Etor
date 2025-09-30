import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString } from "class-validator";


export class LoginWithFirebaseDto {
  @Type()
  @IsString()
  @ApiProperty()
  token: string;
}
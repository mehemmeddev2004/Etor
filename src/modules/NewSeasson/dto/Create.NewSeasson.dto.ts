import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { SeasonType } from "src/shared/enum/Seasson.enum";


export class CreateNewSeassonDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  
  name: string;

  @IsEnum(SeasonType)
  @ApiProperty()

  seasonType: SeasonType;
}

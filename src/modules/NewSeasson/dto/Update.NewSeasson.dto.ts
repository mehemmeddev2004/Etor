import { IsEnum, IsOptional, IsString } from "class-validator";
import { SeasonType } from "src/shared/enum/Seasson.enum";

export class UpdateNewSeassonDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(SeasonType)
  seasonType?: SeasonType;
}

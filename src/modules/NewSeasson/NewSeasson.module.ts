import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NewSeasonEntity } from "src/database/NewSeason.entity";
import { NewSeasonService } from "./NewSeasson.service";
import { NewSeassonController } from "./NewSeasson.controller";

@Module({
    imports:[TypeOrmModule.forFeature([NewSeasonEntity])],
    providers:[NewSeasonService],
    controllers:[NewSeassonController]
})
export class NewSeassonModule{

}
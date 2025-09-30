import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProfileEntiry } from "src/database/profile.entity";
import { ProfileService } from "./profile.service";
import { UserModule } from "../user.module";
import { ProfileController } from "./profile.controller";

@Module({
    imports:[TypeOrmModule.forFeature([ProfileEntiry]),UserModule],
    providers:[ProfileService],
    controllers:[ProfileController]
})
export class ProfileModule{

}
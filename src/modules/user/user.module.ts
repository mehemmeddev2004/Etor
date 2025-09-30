import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { userEntity } from "src/database/user.entity";
import { userService } from "./user.service";
import { UserController } from "./user.controller";

@Module({
    imports:[TypeOrmModule.forFeature([userEntity])],
    providers:[userService],
    exports:[userService],
    controllers:[UserController]
})
export class UserModule{}
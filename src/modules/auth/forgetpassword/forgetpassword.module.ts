import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { userEntity } from "src/database/user.entity";
import { userService } from "src/modules/user/user.service";
import { ForgetPasswordService } from "./forgetpassword.service";
import { forgetPasswordController } from "./forgetpassword.controller";

@Module({
    imports:[TypeOrmModule.forFeature([userEntity])],
    providers:[ForgetPasswordService],
    controllers:[forgetPasswordController]
})
export class forgetPasswordModule{

}
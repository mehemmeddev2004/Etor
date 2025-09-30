import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { userEntity } from "src/database/user.entity";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthUtils } from './auth-utils';
import { FirebaseModule } from "src/libs/firebase/firebase.module";

@Module({
    imports:[TypeOrmModule.forFeature([userEntity]),FirebaseModule],
    controllers:[AuthController],
    providers:[AuthService, AuthUtils]
})
export class AuthModule{}
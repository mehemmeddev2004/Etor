import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { userEntity } from "src/database/user.entity";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthUtils } from './auth-utils';
import { FirebaseModule } from "src/libs/firebase/firebase.module";
import jwtConfig from "src/config/jwt.config";

@Module({
    imports: [
        TypeOrmModule.forFeature([userEntity]),
        FirebaseModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('jwt.secret'),
                signOptions: {
                    expiresIn: configService.get<string>('jwt.signOptions.expiresIn'),
                },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, AuthUtils],
    exports: [JwtModule],
})
export class AuthModule{}
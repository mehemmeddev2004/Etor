import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { userEntity } from "src/database/user.entity";
import { userActivationEntity } from "src/database/userActication.entity";
import { ForgetPasswordService } from "./forgetpassword.service";
import { forgetPasswordController } from "./forgetpassword.controller";

@Module({
    imports:[
        TypeOrmModule.forFeature([userEntity, userActivationEntity]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: { expiresIn: '7d' },
            }),
        }),
    ],
    providers:[ForgetPasswordService],
    controllers:[forgetPasswordController]
})
export class forgetPasswordModule{

}
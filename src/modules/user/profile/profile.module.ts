import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ProfileEntiry } from "src/database/profile.entity";
import { ProfileService } from "./profile.service";
import { UserModule } from "../user.module";
import { ProfileController } from "./profile.controller";

@Module({
    imports:[
        TypeOrmModule.forFeature([ProfileEntiry]),
        UserModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: { expiresIn: '7d' },
            }),
        }),
    ],
    providers:[ProfileService],
    controllers:[ProfileController]
})
export class ProfileModule{

}
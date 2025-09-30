import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CategoryEntity } from "src/database/Category.entity";
import { CategoryService } from "./category.service";
import { CategoryController } from "./category.controller";
import { UserModule } from "../user/user.module";

@Module({
    imports:[
        TypeOrmModule.forFeature([CategoryEntity]),
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
    providers:[CategoryService],
    controllers:[CategoryController]
})
export class categoryModule{}
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { UserModule } from "../user/user.module";
import { categoryModule } from "../category/category.module";
import { ProductEntity } from "src/database/Product.entity";
import { CloudinaryModule } from "src/libs/cloudinary/cloudinary.module";

@Module({
    imports:[
        TypeOrmModule.forFeature([ProductEntity]),
        UserModule,
        categoryModule,
        CloudinaryModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: { expiresIn: '7d' },
            }),
        }),
    ],
    providers:[ProductService],
    controllers:[ProductController]
})
export class ProductModule{}
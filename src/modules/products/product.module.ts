import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { UserModule } from "../user/user.module";
import { categoryModule } from "../category/category.module";
import { ProductEntity } from "src/database/Product.entity";
import { CloudinaryModule } from "src/libs/cloudinary/cloudinary.module";

@Module({
    imports:[TypeOrmModule.forFeature([ProductEntity]),UserModule, categoryModule, CloudinaryModule],
    providers:[ProductService],
    controllers:[ProductController]
})
export class ProductModule{}
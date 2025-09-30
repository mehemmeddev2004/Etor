import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryEntity } from "src/database/Category.entity";
import { CategoryService } from "./category.service";
import { CategoryController } from "./category.controller";
import { UserModule } from "../user/user.module";

@Module({
    imports:[TypeOrmModule.forFeature([CategoryEntity]),UserModule],
    providers:[CategoryService],
    controllers:[CategoryController]
})
export class categoryModule{}
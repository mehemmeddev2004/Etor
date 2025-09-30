import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { FilterCategoryDto } from "./dto/filter-category.dto";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "src/guard/auth.guard";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Controller('category')
export class CategoryController{
    constructor(
        private categoryService: CategoryService
    ){}

 
    @Get('find')
    find(){
        return this.categoryService.find()
    }


    @Get()
    findbyId(@Param('id') id:number){
        return this.categoryService.findById(id)
    }

    @Get('filter')
    filter(@Query() @Body() body: FilterCategoryDto){
    return this.categoryService.filter(body)
    }

    @Post()
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    create(@Body() body: CreateCategoryDto){
        return this.categoryService.create(body)
    }


    @Post(':id/categoryId')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    update(@Param('id') id:number,@Body() body: UpdateCategoryDto){
        return this.categoryService.update(body,id)
    }


    @Delete(':id/categoryId')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    delete(@Param('id') id:number){
        return this.categoryService.delete(id)
    }




}
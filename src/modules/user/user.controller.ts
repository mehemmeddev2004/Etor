import { Controller, Delete, Get, Param } from "@nestjs/common";
import { userService } from "./user.service";

@Controller('user')
export class UserController{
    constructor(
        private userService: userService
    ){}

    @Get()
    find(){
        return this.userService.find()
    }

    @Get(':id')
    findById(@Param('id') id:number){
        return this.userService.findById(id)
    }

    @Delete(':id')
    delete(@Param('id') id:number){
        return this.userService.delete(id)
    }


}
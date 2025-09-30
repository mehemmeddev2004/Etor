import { Body, Controller, Post } from "@nestjs/common";
import { ForgetPasswordService } from "./forgetpassword.service";
import { CreateForgetPasswordDto } from "./dto/create-forgetpassword.dto";
import { ConfirmForgetPaswordDto } from "./dto/confirm-forgetpassword.dto";

@Controller('forgetpassword')
export class forgetPasswordController{
    constructor(
        private forgetPasswordService: ForgetPasswordService
    ){}
   
    @Post('createForgetPasswordRequest')
    createForgetPasswordRequest(@Body() body: CreateForgetPasswordDto){
      return this.forgetPasswordService.createForgetPasswordRequest(body)
    }

    @Post('confirmForgetPasswordRequest')
    confirmForgetPasswordRequest(@Body() body: ConfirmForgetPaswordDto){
         return this.forgetPasswordService.confirmForgetPasswordRequest(body)
    }

}
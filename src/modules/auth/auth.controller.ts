import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthloginDto } from "./dto/auth-login.dto";
import { AuthRegisterDto } from "./dto/auth-register.dto";
import { LoginWithFirebaseDto } from "./dto/Login-firebase.dto";

@Controller('auth')
export class AuthController{
    constructor(
        private AuthService: AuthService
    ){}
    
    @Post('login')
    login(@Body() body: AuthloginDto){
     return this.AuthService.login(body)
    }
    @Post('register')
    register(@Body() body: AuthRegisterDto){
        return this.AuthService.register(body)
    }

    @Post('loginWithFirebase')
    loginWithFirebase(@Body() body: LoginWithFirebaseDto){
     return this.AuthService.loginWithFirebase(body)
    }

}
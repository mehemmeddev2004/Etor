import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectDataSource } from "@nestjs/typeorm";
import { ClsService } from "nestjs-cls";
import { userEntity } from "src/database/user.entity";
import { DataSource, FindOptionsWhere, In, Repository } from "typeorm";
import { AuthloginDto } from "./dto/auth-login.dto";
import { compare } from 'bcrypt';
import { AuthRegisterDto } from "./dto/auth-register.dto";
import { LoginAttempts } from "src/database/LoginAttemps.entity";
import config from "src/config";
import { AuthUtils } from './auth-utils';
import { LoginWithFirebaseDto } from "./dto/Login-firebase.dto";
import { UserProvider, UserRole } from "src/shared/enum/user.enum";
import { FirebaseService } from "src/libs/firebase/firebase.service";
import { v4 } from 'uuid';

@Injectable()
export class AuthService {
    private loginAttempsRepo: Repository<LoginAttempts>
    private userRepo: Repository<userEntity>
    constructor(
        private firebaseService: FirebaseService,
        private cls: ClsService,
        private jwtService: JwtService,
        private authUtils: AuthUtils,
        @InjectDataSource() private dataSoruce: DataSource
    ) {
        this.loginAttempsRepo = this.dataSoruce.getRepository(LoginAttempts)
        this.userRepo = this.dataSoruce.getRepository(userEntity)
    }

    async login(params: AuthloginDto) {
        if (!params.email) {
            throw new UnauthorizedException('Email is required');
        }

        const identifier = params.email.toLowerCase();

        const user = await this.userRepo.findOne({
            where: [
                { email: identifier }
            ]
        });

        if (!user) {
            throw new UnauthorizedException('User or password is wrong');
        }


        const isPasswordValid = await compare(params.password, user.password);
        if (!isPasswordValid) {
           
            throw new UnauthorizedException('User or password is wrong');
        }

        const payload = { userId: user.id, };
        const token = this.jwtService.sign(payload);

        return { user, token };
    }


    async register(params: AuthRegisterDto) {
        if (!params.email || !params.password) {
            throw new UnauthorizedException("Please fill all fields");
        }

        
        

        const existingEmail = await this.userRepo.findOne({
            where: { email: params.email },
        });
        if (existingEmail) {
            throw new ConflictException("Email already exists");
        }


       const user = this.userRepo.create({
  ...params,
  role: UserRole[params.role as keyof typeof UserRole], 
});
        await this.userRepo.save(user);

        return user;
    }

    async loginWithFirebase(params: LoginWithFirebaseDto) {
        let admin = this.firebaseService.firebaseApp

        let firebaseResult = await admin.auth().verifyIdToken(params.token);

        if (!firebaseResult?.uid)
            throw new InternalServerErrorException('Something went wrong');

        let uid = firebaseResult.uid;
        let email = firebaseResult.email;

        let where: FindOptionsWhere<userEntity>[] = [
      {
        providerId: uid,
        provider: UserProvider.FIREBASE,
      },
    ];
    
      if (email) {
      where.push({
        email,
      });
    }

    let user = await this.userRepo.findOne({
      where,
    });

    if (!user) {

      user = this.userRepo.create({
        email,
        password: v4(),
        provider: UserProvider.FIREBASE,
        providerId: uid,
      });

      await this.userRepo.save(user);
    }

    let token = this.authUtils.generateToken(user.id);

    return {
      user,
      token,
    };
    }


  
   
    async clearLoginAttempts(user: userEntity) {
        let ip = this.cls.get('ip');
        await this.loginAttempsRepo.delete({ ip, userId: user.id });
    }



}
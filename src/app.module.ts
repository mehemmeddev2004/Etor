import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClsModule } from 'nestjs-cls';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { UserModule } from './modules/user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { forgetPasswordModule } from './modules/auth/forgetpassword/forgetpassword.module';
import { FirebaseModule } from './libs/firebase/firebase.module';
import { categoryModule } from './modules/category/category.module';
import { ProfileModule } from './modules/user/profile/profile.module';
import { ProductController } from './modules/products/product.controller';
import { ProductModule } from './modules/products/product.module';
import { PaymentModule } from './modules/payment/payment.module';
import { NewSeassonModule } from './modules/NewSeasson/NewSeasson.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true
      },
      interceptor: { mount: true },
    }),
   TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: +config.get('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_DATABASE'),
        entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
        synchronize: process.env.NODE_ENV !== 'production',
        logging: process.env.NODE_ENV !== 'production',
        retryAttempts: 10,
        retryDelay: 3000,
        autoLoadEntities: true,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        connectTimeoutMS: 60000,
        acquireTimeoutMS: 60000,
        timeout: 60000,
      }),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        return {
          transport: {
            service: 'gmail',
            host: config.get('SMTP_HOST') || 'smtp.gmail.com',
            port: parseInt(config.get('SMTP_PORT') || '587'),
            secure: config.get('SMTP_SECURE') === 'true' || false,
            auth: {
              user: config.get('SMTP_USER'),
              pass: config.get('SMTP_PASS'),
            },
            tls: {
              rejectUnauthorized: false,
            },
          },
          defaults: {
            from: `"Etor" <${config.get('SMTP_FROM')}>`,
          },
          template: {
            dir: join(process.cwd(), 'src', 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        return {
          secret: config.get('JWT_SECRET'),
          signOptions: { expiresIn: '1d' },
        };
      },
    }),
      ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    UserModule,
    AuthModule,
    ProfileModule,
    forgetPasswordModule,
    FirebaseModule,
    categoryModule,
    ProductModule,
    PaymentModule,
    NewSeassonModule,
    UploadModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

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
      useFactory: async (config: ConfigService) => {
        // Check if DATABASE_URL is provided (common in Render)
        const databaseUrl = config.get('DATABASE_URL');
        
        let dbConfig;
        
        if (databaseUrl) {
          // Parse DATABASE_URL
          dbConfig = {
            type: 'postgres' as const,
            url: databaseUrl,
          };
        } else {
          // Use individual environment variables
          dbConfig = {
            type: 'postgres' as const,
            host: config.get('DB_HOST') || 'localhost',
            port: +config.get('DB_PORT') || 5432,
            username: config.get('DB_USERNAME') || 'postgres',
            password: config.get('DB_PASSWORD') || '',
            database: config.get('DB_DATABASE') || 'postgres',
          };
        }
        
        // Add common configuration
        Object.assign(dbConfig, {
          entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
          synchronize: process.env.NODE_ENV !== 'production',
          logging: process.env.NODE_ENV !== 'production',
          retryAttempts: 3,
          retryDelay: 2000,
          autoLoadEntities: true,
          ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
          connectTimeoutMS: 5000,
          acquireTimeoutMS: 5000,
          timeout: 5000,
          keepConnectionAlive: true,
          dropSchema: false,
          migrationsRun: false,
          extra: {
            connectionLimit: 10,
          },
        });
        
        console.log('Environment variables check:', {
          NODE_ENV: process.env.NODE_ENV,
          DB_HOST: process.env.DB_HOST,
          DB_PORT: process.env.DB_PORT,
          DB_USERNAME: process.env.DB_USERNAME,
          DB_DATABASE: process.env.DB_DATABASE,
          DATABASE_URL: process.env.DATABASE_URL
        });
        
        console.log('Database configuration:', {
          host: dbConfig.host,
          port: dbConfig.port,
          database: dbConfig.database,
          username: dbConfig.username
        });
        
        return dbConfig;
      },
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

    NewSeassonModule,
    UploadModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

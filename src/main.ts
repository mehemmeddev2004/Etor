import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: ['error', 'warn', 'log'],
    });
    app.useStaticAssets(join(__dirname, '..', '..', 'public'));
  
  // CORS configuration for production and development

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://coming-soon-woad-rho.vercel.app',
      'https://etor-frontend.vercel.app',
      'https://etor.vercel.app',
      'https://coming-soon-etor.vercel.app'
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
    maxAge: 86400, // 24 hours
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.setGlobalPrefix('api');

  // Add explicit OPTIONS handling for preflight requests
  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Max-Age', '86400');
      return res.sendStatus(200);
    }
    next();
  });

  // Only enable Swagger in development
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Etor')
      .setDescription('The Etor API description')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('docs', app, document, {
      customCssUrl: `/swagger.dark.css`,
      customSiteTitle: 'Etor API Docs',
      swaggerOptions: {
        filter: true,
      },
    });
    
    console.log('📚 Swagger documentation available at: /docs');
  } else {
    console.log('📚 Swagger disabled in production mode');
  }

    const port = process.env.PORT || 3001;
    await app.listen(port, '0.0.0.0');
    console.log(`Application is running on: http://0.0.0.0:${port}`);
  } catch (error) {
    console.error('Error starting application:', error);
    process.exit(1);
  }
}
bootstrap();
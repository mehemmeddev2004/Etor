import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      message: 'Application is running',
      port: process.env.PORT || 3001
    };
  }

  @Get('ping')
  ping() {
    return { message: 'pong', timestamp: new Date().toISOString() };
  }

  @Get('database-info')
  getDatabaseInfo() {
    return {
      database: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_DATABASE,
        username: process.env.DB_USERNAME,
        connection_url: process.env.DATABASE_URL ? 'Connected via URL' : 'Connected via individual params'
      },
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    };
  }
}

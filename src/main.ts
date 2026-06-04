import * as dns from 'dns';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter, AllExceptionsFilter } from './common/filters';
import { ResponseInterceptor } from './common/interceptors';
import { CustomValidationPipe } from './common/pipes';

dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.setDefaultResultOrder('ipv4first');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  // Global Pipes
  app.useGlobalPipes(new CustomValidationPipe());

  // Global Interceptors
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Global Exception Filters - Order matters! More specific first
  app.useGlobalFilters(new HttpExceptionFilter(), new AllExceptionsFilter());

  await app.listen(process.env.PORT || 5000);
  console.log(`Server running on http://localhost:${process.env.PORT || 5000}`);
}

bootstrap();
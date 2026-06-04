import * as dns from 'dns';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter, AllExceptionsFilter } from './common/filters';
import { ResponseInterceptor } from './common/interceptors';
import { CustomValidationPipe } from './common/pipes';

// DNS config (only once)
dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.setDefaultResultOrder('ipv4first');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin: ['http://localhost:3000'], // production la update pannunga
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  // Global Pipes: use custom validation plus Nest's ValidationPipe
  app.useGlobalPipes(
    new CustomValidationPipe(),
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  // Global Interceptors
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Global Exception Filters - Order matters! More specific first
  app.useGlobalFilters(new HttpExceptionFilter(), new AllExceptionsFilter());

  // Global prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 5000;

  await app.listen(port);

  console.log(`🚀 Server running on http://localhost:${port}/api`);
}

bootstrap();
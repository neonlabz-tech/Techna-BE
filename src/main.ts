import * as dns from 'dns';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter, AllExceptionsFilter } from './common/filters';
import { CustomValidationPipe } from './common/pipes';

// DNS config (helps with MongoDB / network resolution issues)
dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.setDefaultResultOrder('ipv4first');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS (safe for frontend + production flexible)
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  // Global Pipes: use custom validation plus Nest's ValidationPipe
  app.useGlobalPipes(
    new CustomValidationPipe(),
    new ValidationPipe({
      whitelist: true, // remove unknown fields
      forbidNonWhitelisted: false,
      transform: true, // auto transform types
    }),
  );

  // Global Interceptors are registered via AppModule providers

  // Global Exception Filters - Order matters! More specific first
  app.useGlobalFilters(new HttpExceptionFilter(), new AllExceptionsFilter());

  // Global prefix
  app.setGlobalPrefix('api');

  const port = Number(process.env.PORT) || 4000;

  await app.listen(port);

  console.log(`🚀 Techna API running on http://localhost:${port}/api`);
}

bootstrap();

import * as dns from 'dns';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter, AllExceptionsFilter } from './common/filters';

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

  // Global Validation Pipe
  // CustomValidationPipe removed — it was blocking GET requests with "No data submitted"
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,             // strip unknown fields before reaching service
      forbidNonWhitelisted: true,  // throw 400 if unknown fields are sent
      transform: true,             // auto transform types
    }),
  );

  // Global Exception Filters - Order matters! More specific first
  app.useGlobalFilters(new HttpExceptionFilter(), new AllExceptionsFilter());

  // Global prefix
  app.setGlobalPrefix('api');

  const port = Number(process.env.PORT) || 4000;

  await app.listen(port);

  console.log(`🚀 Techna API running on http://localhost:${port}/api`);
}

bootstrap();
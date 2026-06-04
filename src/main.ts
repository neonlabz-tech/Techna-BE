import * as dns from 'dns';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

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

  // Global validation pipe (DTO validation)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove unknown fields
      forbidNonWhitelisted: false,
      transform: true, // auto transform types
    }),
  );

  // Global API prefix
  app.setGlobalPrefix('api');

  const port = Number(process.env.PORT) || 4000;

  await app.listen(port);

  console.log(`🚀 Techna API running on http://localhost:${port}/api`);
}

bootstrap();
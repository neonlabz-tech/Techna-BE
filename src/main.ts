import * as dns from 'dns';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.setDefaultResultOrder('ipv4first');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ─────────────────────────────
  // CORS (secure setup)
  // ─────────────────────────────
  app.enableCors({
    origin: ['http://localhost:3000'], // change in production
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // ─────────────────────────────
  // Global validation pipe
  // ─────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  // ─────────────────────────────
  // Global prefix
  // ─────────────────────────────
  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 4000;

  await app.listen(port);

  console.log(`🚀 Server running on http://localhost:${port}/api`);
}

bootstrap();
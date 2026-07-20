import * as dns from 'dns';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter, AllExceptionsFilter } from './common/filters';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


// DNS config (helps with MongoDB / network resolution issues)
dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.setDefaultResultOrder('ipv4first');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS (safe for frontend + production flexible)
      const allowedOrigins = [
        'https://admin-techna.vercel.app',
        'https://techna.vercel.app',
        'http://localhost:3000',
        'http://localhost:3001',
      ];

      app.enableCors({
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
        },
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 204,
      });


  // Global Validation Pipe
  // CustomValidationPipe removed — it was blocking GET requests with "No data submitted"
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,             
      forbidNonWhitelisted: true,  
      transform: true,             
    }),
  );

  // Global Exception Filters - Order matters! More specific first
  app.useGlobalFilters(new HttpExceptionFilter(), new AllExceptionsFilter());

  // Global prefix
  app.setGlobalPrefix('api');

  // =========================
  // 🔥 SWAGGER SETUP
  // =========================

  const config = new DocumentBuilder()
    .setTitle('Techna POS API')
    .setDescription('Swagger API documentation for Techna POS backend')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    useGlobalPrefix: false,
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = Number(process.env.PORT) || 4000;

  await app.listen(port);

  console.log(`🚀 Techna API running on http://localhost:${port}/api`);
  console.log(`📘 Swagger running on http://localhost:${port}/api/docs`);
}

bootstrap();

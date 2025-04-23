import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000; 

  app.enableCors({
    origin: '*', // Usar la variable de entorno para el origen permitido
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Métodos HTTP permitidos
    allowedHeaders: [
    'Content-Type',
    'Authorization',
    'sec-ch-ua',
    'sec-ch-ua-mobile',
    'sec-ch-ua-platform',
    'user-agent',
  ], // Cabeceras permitidas
    
  });

  const server = app.getHttpAdapter().getInstance();

  // Servir archivos estáticos
  server.use(express.static(join(__dirname, '../public')));


  await app.listen(port);
}
bootstrap();
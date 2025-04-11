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

  // Configuración completa de CORS para permitir todos los orígenes
  app.enableCors({
    origin: true, // Más flexible que '*' y permite credenciales
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
      'Access-Control-Allow-Headers',
      'Access-Control-Request-Headers',
      'Access-Control-Request-Method',
      'sec-ch-ua',
      'sec-ch-ua-mobile',
      'sec-ch-ua-platform',
      'user-agent',
    ],
    exposedHeaders: [
      'Authorization',
      'Access-Control-Allow-Origin',
      'Content-Length',
      'Content-Type'
    ],
    credentials: false, // Si necesitas credenciales, cambia a true
    maxAge: 86400, // Tiempo de cache para CORS preflight
    preflightContinue: false,
    optionsSuccessStatus: 204
  });

  const server = app.getHttpAdapter().getInstance();

  // Middleware adicional para manejar OPTIONS (algunos clientes lo necesitan)
  server.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers'] || '*');
      return res.status(204).end();
    }
    next();
  });

  // Servir archivos estáticos
  server.use(express.static(join(__dirname, '../public')));

  await app.listen(port);
}
bootstrap();

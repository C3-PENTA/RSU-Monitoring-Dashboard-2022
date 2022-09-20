import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  let httpsOptions: { key: Buffer; cert: Buffer };
  if (process.env.NODE_ENV !== 'development') {
    httpsOptions = {
      key: fs.readFileSync('./gmoseapp.key'),
      cert: fs.readFileSync('./gmoseapp.csr'),
    };
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    httpsOptions,
  });

  app.enableCors({
    origin: process.env.FE_URL ? process.env.FE_URL.split(',') : '*',
    credentials: true,
    preflightContinue: false,
  });

  app.setGlobalPrefix('api');


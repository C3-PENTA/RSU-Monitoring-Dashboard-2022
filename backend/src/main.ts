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

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('Penta Security')
    .setDescription('Penta Security Swagger API Document')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(Number(process.env.APP_PORT) || 3000);
}
void bootstrap();

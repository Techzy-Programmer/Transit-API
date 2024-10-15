import { NotFoundExceptionFilter } from './common/filters/not-found-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Transit API')
    .setDescription('The Transit API description')
    .setVersion('1.0')
    .addTag('transit')
    .build();

  const document = SwaggerModule.createDocument(app, config, { deepScanRoutes: true });
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(new ValidationPipe({
    forbidNonWhitelisted: true,
    whitelist: true,
    transform: true
  }));

  app.useGlobalFilters(new NotFoundExceptionFilter());
  app.use(cookieParser());
  await app.listen(3000);
}

bootstrap();

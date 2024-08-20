import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './http-exception.filter';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import * as process from 'node:process';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors();
  const PORT = process.env.PORT || 3000;

  await app.listen(PORT, () => console.log(`Listening on port ${PORT} on environment ${process.env.NODE_ENV || 'development'}`));
}
bootstrap();

import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './http-exception.filter';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import * as process from 'node:process';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'hbs';
import * as helpers from 'handlebars-helpers';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter());
  app.use(cookieParser())
  app.useStaticAssets(join(process.cwd(),'public'));
  app.setBaseViewsDir(join(process.cwd(),'views'));
  app.setViewEngine('hbs');
  hbs.registerHelper(helpers());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors({
    allowedHeaders: 'Authorization, Content-Type',
  });
  const PORT = process.env.PORT || 3000;

  await app.listen(PORT, () => console.log(`Listening on port ${PORT} on environment ${process.env.NODE_ENV || 'development'}`));
}
bootstrap();

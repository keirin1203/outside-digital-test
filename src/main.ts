import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: ['POST', 'GET', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD', 'PUT'],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT);

  console.log('[WEB]', `http://localhost:${process.env.PORT}`);
}
bootstrap();

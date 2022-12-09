/**
 *  This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as SentryTracing from '@sentry/tracing';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SentryTracing.addExtensionMethods();
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const host = process.env.NEST_HOST || '0.0.0.0';
  const port = process.env.NEST_PORT || 3333;
  await app.listen(port, host);
  Logger.log(
    `🚀 Nestjs Server Application is running on: http://${host}:${port}/${globalPrefix}`
  );
}

bootstrap();

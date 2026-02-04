import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppConfigService } from './infrastracture/config/app-config.service';
import { APP_CONFIG } from './common/tokens';
import { AppExceptionFilter } from './api/filters';
import { useFilters, useSwagger } from './extension';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(APP_CONFIG) as AppConfigService;

  // Add Extensions
  useSwagger(app);
  useFilters(app);

  // Start the application
  await app.listen(configService.port);
}
bootstrap();

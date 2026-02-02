import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './infrastracture/config/app-config.service';
import { APP_CONFIG } from './common/tokens';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<AppConfigService>(APP_CONFIG);
  await app.listen(configService.port);
}
bootstrap();

import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './infrastracture/config/app-config.service';
import { APP_CONFIG } from './common/tokens';
import { useFilters, useInputValidations, useSwagger } from './extension';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(APP_CONFIG) as AppConfigService;

  // Add Extensions
  useSwagger(app);
  useFilters(app);
  useInputValidations(app);

  // Start the application
  await app.listen(configService.port);
}
bootstrap();

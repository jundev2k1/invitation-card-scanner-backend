import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import { AppModule } from './app.module';
import { APP_CONFIG } from './common/tokens';
import { useFilters, useInputValidations, useSwagger } from './extension';
import { AppConfigService } from './infrastracture/config/app-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(APP_CONFIG) as AppConfigService;

  // Set trust proxy
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', true);

  // Add Extensions
  useSwagger(app);
  useFilters(app);
  useInputValidations(app);

  // Start the application
  await app.listen(configService.port);
}
bootstrap();

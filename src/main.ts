import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppConfigService } from './infrastracture/config/app-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(AppConfigService);

  // Add swagger setup
  const config = new DocumentBuilder()
    .setTitle('Invitation Card Scanner API')
    .setDescription('The Invitation Card Scanner API description')
    .setVersion('1.0')
    .addTag('invitation-card-scanner')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  // Start the application
  await app.listen(configService.port);
}
bootstrap();

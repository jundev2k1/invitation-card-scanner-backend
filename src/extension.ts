import { INestApplication } from "@nestjs/common";
import { AppExceptionFilter } from "./api/filters";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export const useFilters = (app: INestApplication) => {
  app.useGlobalFilters(new AppExceptionFilter());
}

export const useSwagger = (app: INestApplication) => {
    // Add swagger setup
    const config = new DocumentBuilder()
      .setTitle('Invitation Card Scanner API')
      .setDescription('The Invitation Card Scanner API description')
      .setVersion('1.0')
      .addTag('invitation-card-scanner')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);
}

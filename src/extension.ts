import { INestApplication, Logger, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppExceptionFilter } from "./api/filters";
import { BadRequestException } from "./application/common";
import { ApiMessages } from "./common/constants";

export const useInputValidations = (app: INestApplication) => {
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (validationErrors) => {
      const detailedErrors = validationErrors.map(error => ({
        property: error.property,
        constraints: error.constraints,
        children: error.children?.length ? error.children : undefined
      }));

      const messages = detailedErrors
        .map(err => Object.values(err.constraints || {}))
        .flat();
      Logger.error(messages);

      return BadRequestException.create(ApiMessages.VALIDATION_ERROR);
    },
    whitelist: true,
    transform: true,
  }));
}

export const useFilters = (app: INestApplication) => {
  app.useGlobalFilters(new AppExceptionFilter());
}

export const useSwagger = (app: INestApplication) => {
  // Add swagger setup
  const config = new DocumentBuilder()
    .setTitle('Invitation Card Scanner API')
    .setDescription('The Invitation Card Scanner API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
}

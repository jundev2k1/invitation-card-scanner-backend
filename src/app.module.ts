import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { ApiModule } from './api/api.module';
import { ApplicationModule } from './application/application.module';
import { DomainModule } from './domain/domain.module';
import { validate } from './infrastracture/config/app-config.validation';
import { InfrastructureModule } from './infrastracture/infrastructure.module';

const providers = [
  DomainModule,
  InfrastructureModule,
  ApplicationModule,
  ApiModule,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      envFilePath: [
        `.env.${process.env.NODE_ENV || 'development'}`,
        '.env',
      ],
    }),
    CqrsModule.forRoot(),
    ...providers
  ]
})

export class AppModule { };

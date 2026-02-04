import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './infrastracture/config/app-config.validation';
import { InfrastructureModule } from './infrastracture/infrastructure.module';
import { ApplicationModule } from './application/application.module';
import { ApiModule } from './api/api.module';
import { DomainModule } from './domain/domain.module';

const providers = [
  DomainModule,
  InfrastructureModule,
  ApplicationModule,
  ApiModule,
];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }),
    ...providers
  ]
})

export class AppModule { };

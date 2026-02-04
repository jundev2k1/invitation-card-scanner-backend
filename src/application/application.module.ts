import { Module } from '@nestjs/common';
import { CqrsModule } from './features/cqrs.module';

const providers = [CqrsModule];

@Module({
  imports: providers,
  exports: providers,
})

export class ApplicationModule { };
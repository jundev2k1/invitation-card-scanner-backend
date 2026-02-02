import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './infrastracture/config/app-config.validation';
import { AppConfigService } from './infrastracture/config/app-config.service';
import { AuthController } from './presentation/controllers/auth.controller';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true, validate })],
    providers: [AppConfigService],
    controllers: [AuthController],
    exports: [AppConfigService],
})

export class AppModule { };

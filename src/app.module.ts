import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './infrastracture/config/app-config.validation';
import { AppConfigService } from './infrastracture/config/app-config.service';
import { AuthController } from './presentation/controllers/auth.controller';
import { USER_REPO } from './common/tokens';
import { UserRepo } from './infrastracture/repositories/user.repo';
import { dbProvider } from './infrastracture/database/slonik.provider';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true, validate })],
    providers: [AppConfigService, dbProvider, { provide: USER_REPO, useClass: UserRepo }],
    controllers: [AuthController,],
    exports: [AppConfigService, dbProvider, USER_REPO],
})

export class AppModule { };

import { Module } from "@nestjs/common";
import { JwtModule as NestJwtModule } from "@nestjs/jwt";
import { APP_CONFIG, AUTH_SERVICE } from "src/common/tokens";
import { AppConfigService } from "../config/app-config.service";
import { AuthService } from "./auth.service";
import { RepositoryModule } from "../repositories/repository.module";
import { SecurityModule } from "../security/security.module";

@Module({
  imports: [
    NestJwtModule.registerAsync({
      inject: [APP_CONFIG],
      useFactory: (config: AppConfigService) => ({
        secret: config.jwtSecret,
        signOptions: {
          expiresIn: config.jwtExpiresIn,
        },
      }),
    }),
    RepositoryModule,
    SecurityModule,
  ],
  providers: [
    {
      provide: AUTH_SERVICE,
      useClass: AuthService,
    }
  ],
  exports: [NestJwtModule, AUTH_SERVICE],
})
export class AuthModule { }

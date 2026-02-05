import { Module } from "@nestjs/common";
import { JwtModule, JwtModule as NestJwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { APP_CONFIG, AUTH_SERVICE } from "src/common/tokens";
import { AppConfigService } from "../config/app-config.service";
import { RepositoryModule } from "../repositories/repository.module";
import { SecurityModule } from "../security/security.module";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
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
    JwtStrategy,
    {
      provide: AUTH_SERVICE,
      useClass: AuthService,
    }
  ],
  exports: [JwtModule, JwtStrategy, NestJwtModule, AUTH_SERVICE],
})
export class AuthModule { }

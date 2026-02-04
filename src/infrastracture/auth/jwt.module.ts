import { Module } from "@nestjs/common";
import { JwtModule as NestJwtModule } from "@nestjs/jwt";
import { APP_CONFIG } from "src/common/tokens";
import { AppConfigService } from "../config/app-config.service";

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
  ],
  exports: [NestJwtModule],
})
export class JwtModule { }
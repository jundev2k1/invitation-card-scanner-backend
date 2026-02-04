import { Module } from "@nestjs/common";
import { RepositoryModule } from "./repositories/repository.module";
import { AppConfigModule } from "./config/app-config.module";
import { DatabaseModule } from "./database/database.module";
import { JwtModule } from "./auth/jwt.module";

const modules = [
  AppConfigModule,
  JwtModule,
  DatabaseModule,
  RepositoryModule,
];

@Module({
  imports: modules,
  exports: modules,
})

export class InfrastructureModule { }

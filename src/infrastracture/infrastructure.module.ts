import { Module } from "@nestjs/common";
import { AuthModule } from "./auth";
import { AppConfigModule } from "./config/app-config.module";
import { DatabaseModule } from "./database/database.module";
import { RepositoryModule } from "./repositories/repository.module";
import { SecurityModule } from "./security/security.module";

const modules = [
  AppConfigModule,
  SecurityModule,
  AuthModule,
  DatabaseModule,
  RepositoryModule,
];

@Module({
  imports: modules,
  exports: modules,
})

export class InfrastructureModule { }

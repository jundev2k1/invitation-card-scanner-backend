import { Module } from "@nestjs/common";
import { RepositoryModule } from "./repositories/repository.module";
import { AppConfigModule } from "./config/app-config.module";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./auth/auth.module";
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

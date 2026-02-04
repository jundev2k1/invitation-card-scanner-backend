import { Module } from "@nestjs/common";
import { dbProvider } from "./slonik.provider";
import { POSTGRES_POOL } from "src/common/tokens";
import { AppConfigModule } from "../config/app-config.module";

@Module({
  imports: [AppConfigModule],
  providers: [dbProvider],
  exports: [POSTGRES_POOL],
})
export class DatabaseModule { };

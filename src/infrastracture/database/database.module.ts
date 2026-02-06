import { Module } from "@nestjs/common";
import { POSTGRES_POOL, UNIT_OF_WORK } from "src/common/tokens";
import { AppConfigModule } from "../config/app-config.module";
import { dbProvider } from "./providers/slonik.provider";
import { unitOfWorkProvider } from "./providers/unit-of-work.provider";

@Module({
  imports: [AppConfigModule],
  providers: [dbProvider, unitOfWorkProvider],
  exports: [POSTGRES_POOL, UNIT_OF_WORK],
})
export class DatabaseModule { };

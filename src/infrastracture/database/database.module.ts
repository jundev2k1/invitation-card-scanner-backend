import { Global, Module } from "@nestjs/common";
import { AppConfigService } from "../config/app-config.service";
import { dbProvider } from "./slonik.provider";

@Global()
@Module({
  imports: [AppConfigService],
  providers: [dbProvider],
  exports: [dbProvider],
})
export class DatabaseModule { };

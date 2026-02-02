import { Global, Module } from "@nestjs/common";
import { AppConfigService } from "../config/app-config.service";
import { dbProvider } from "./slonik.provider";
import { POSTGRES_POOL } from "src/common/tokens";

@Global()
@Module({
    imports: [AppConfigService],
    providers: [dbProvider],
    exports: [POSTGRES_POOL],
})
export class DatabaseModule { };

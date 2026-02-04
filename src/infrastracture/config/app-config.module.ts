import { Global, Module } from "@nestjs/common";
import { AppConfigService } from "./app-config.service";
import { APP_CONFIG } from "src/common/tokens";

const configProvider = {
  provide: APP_CONFIG,
  useClass: AppConfigService,
}

@Global()
@Module({
  imports: [],
  providers: [configProvider],
  exports: [APP_CONFIG],
})
export class AppConfigModule { }

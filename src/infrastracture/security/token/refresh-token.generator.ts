import { Inject } from "@nestjs/common";
import { createHash } from "crypto";
import { addMinutes } from "date-fns";
import { APP_CONFIG } from "src/common/tokens";
import { AppConfigService } from "src/infrastracture/config/app-config.service";

export class RefreshTokenGenerator {
  constructor(@Inject(APP_CONFIG) private readonly config: AppConfigService) { }

  async generate(): Promise<[string, Date]> {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const tokenHash = createHash('sha256').update(token).digest('hex');

    const expiryDate = addMinutes(new Date(), this.config.jwtRefreshExpiresIn);
    return [tokenHash, expiryDate];
  }
}

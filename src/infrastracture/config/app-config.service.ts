import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAppConfig } from '../../domain/interfaces/configs/config.interface';

@Injectable()
export class AppConfigService implements IAppConfig {
  constructor(private configService: ConfigService) { }

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV') || 'Development';
  }
  get port(): number {
    return this.configService.get<number>('PORT') || 3000;
  }
  get databaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL') || '';
  }
  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET') || '';
  }
  get jwtExpiresIn(): number {
    return this.configService.get<number>('JWT_EXPIRES_IN') || 3600;
  }
}

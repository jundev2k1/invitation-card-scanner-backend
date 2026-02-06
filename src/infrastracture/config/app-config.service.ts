import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';
import { IAppConfig } from '../../domain/interfaces/configs/config.interface';

@Injectable()
export class AppConfigService implements IAppConfig {
  constructor(private configService: ConfigService) { }

  /** The current environment */
  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV') || 'Development';
  }
  /** The port to listen on */
  get port(): number {
    return this.configService.get<number>('PORT') || 3000;
  }
  /** The database connection string */
  get databaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL') || '';
  }
  /** The secret used to sign access tokens */
  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET') || '';
  }
  /** The number of days after which an access token expires (defaults to 15 minutes) */
  get jwtExpiresIn(): StringValue {
    return this.configService.get<StringValue>('JWT_EXPIRES_IN') || '900s';
  }
  /** The number of days after which an access token expires (minutes) */
  get jwtRefreshExpiresIn(): number {
    return this.configService.get<number>('JWT_REFRESH_EXPIRES_IN') || 10080;
  }
}

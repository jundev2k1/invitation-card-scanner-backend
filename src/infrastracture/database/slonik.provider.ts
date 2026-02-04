import { createPool, DatabasePool } from 'slonik';
import { APP_CONFIG, POSTGRES_POOL } from 'src/common/tokens';
import { AppConfigService } from '../config/app-config.service';

export const dbProvider = {
  provide: POSTGRES_POOL,
  useFactory: async (config: AppConfigService): Promise<DatabasePool> => {
    return createPool(config.databaseUrl);
  },
  inject: [APP_CONFIG]
}

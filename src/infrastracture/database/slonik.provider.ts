import { createPool, DatabasePool } from 'slonik';
import { POSTGRES_POOL } from 'src/common/tokens';

export const dbProvider = {
    provider: POSTGRES_POOL,
    useFactory: () : DatabasePool => {
        return createPool(process.env.DATABASE_URL!);
    }
}

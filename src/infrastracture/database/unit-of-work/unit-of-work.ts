import { Inject, Injectable } from "@nestjs/common";
import type { DatabasePool } from "slonik";
import { POSTGRES_POOL } from "src/common/tokens";
import { transactionStorage } from "./transaction-storage";

@Injectable()
export class UnitOfWork {
  constructor(@Inject(POSTGRES_POOL) private readonly pool: DatabasePool) { }

  async withTransaction<T>(work: () => Promise<T>): Promise<T> {
    return await this.pool.transaction(async (tx) => {
      return transactionStorage.run(tx, work);
    });
  }
}

import { GeneralStatisticsDto, IGeneralStatisticsRaw } from "@/src/application/features/analysis/dtos/general-statistics.dto";
import { POSTGRES_POOL } from "@/src/common/tokens";
import { IAnalysisRepo } from "@/src/domain/interfaces/repositories/analysis.repo";
import { Inject } from "@nestjs/common";
import { type DatabasePool, DatabaseTransactionConnection, sql } from "slonik";
import { transactionStorage } from "../../database";

export class AnalysisRepo implements IAnalysisRepo {
  private get dbContext(): DatabaseTransactionConnection | DatabasePool {
    return transactionStorage.getStore() || this.pool;
  }

  constructor(
    @Inject(POSTGRES_POOL) private readonly pool: DatabasePool
  ) { }

  async getGeneralStatistics(dateFrom: Date, dateTo: Date): Promise<GeneralStatisticsDto> {
    const query = sql.unsafe`SELECT * FROM get_general_statistics(
      ${dateFrom.toISOString()},
      ${dateTo.toISOString()}
     )`;
    const { rows } = await this.dbContext.query(query);
    return GeneralStatisticsDto.mapFromRaw(rows[0] as IGeneralStatisticsRaw);
  }
}

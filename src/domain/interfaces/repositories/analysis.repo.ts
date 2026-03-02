import { GeneralStatisticsDto } from "@/src/application/features/analysis/dtos/general-statistics.dto";

export interface IAnalysisRepo {
  getGeneralStatistics(dateFrom: Date, dateTo: Date): Promise<GeneralStatisticsDto>;
}

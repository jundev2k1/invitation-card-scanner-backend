import { REPO_FACADE } from "@/src/common/tokens";
import { RepositoryFacade } from "@/src/infrastracture/repositories";
import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GeneralStatisticsDto } from "../../dtos/general-statistics.dto";
import { GetGeneralStatisticsQuery } from "./get-general-statistics.query";

@QueryHandler(GetGeneralStatisticsQuery)
export class GetGeneralStatisticsHandler implements IQueryHandler<GetGeneralStatisticsQuery, GeneralStatisticsDto> {
  constructor(
    @Inject(REPO_FACADE) private readonly repoFacade: RepositoryFacade
  ) { }

  async execute(request: GetGeneralStatisticsQuery): Promise<GeneralStatisticsDto> {
    return this.repoFacade.analysis.getGeneralStatistics(request.startDate, request.endDate);
  }
}

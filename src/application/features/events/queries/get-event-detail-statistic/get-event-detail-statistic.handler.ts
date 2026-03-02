import { REPO_FACADE } from "@/src/common/tokens";
import { RepositoryFacade } from "@/src/infrastracture/repositories";
import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { EventDetailStatsDto } from "../../dtos";
import { GetEventDetailStatsQuery } from "./get-event-detail-statistic.query";

@QueryHandler(GetEventDetailStatsQuery)
export class GetEventDetailStatsHandler implements IQueryHandler<GetEventDetailStatsQuery, EventDetailStatsDto> {
  constructor(
    @Inject(REPO_FACADE) private readonly repoFacade: RepositoryFacade
  ) { }

  async execute(request: GetEventDetailStatsQuery): Promise<EventDetailStatsDto> {
    const result = await this.repoFacade.event.getStatsById(request.eventId);
    return result;
  }
}

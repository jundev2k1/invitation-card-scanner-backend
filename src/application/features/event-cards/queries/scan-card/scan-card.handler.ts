import { REPO_FACADE } from "@/src/common/tokens";
import { NotFoundException } from "@/src/domain/exceptions";
import { RepositoryFacade } from "@/src/infrastracture/repositories";
import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { EventCardDto } from "../../dtos";
import { mapToDetail } from "../../mapping/event-card.mapping";
import { ScanCardQuery } from "./scan-card.query";

@QueryHandler(ScanCardQuery)
export class ScanCardHandler implements IQueryHandler<ScanCardQuery, EventCardDto> {
  constructor(
    @Inject(REPO_FACADE) private readonly repoFacade: RepositoryFacade
  ) { }

  async execute(request: ScanCardQuery): Promise<EventCardDto> {
    // Get event card detail
    const result = await this.repoFacade.eventCard.getByAccessToken(request.code);
    if (!result) throw NotFoundException.create('AccessToken', request.code);

    // Get event card logs
    const logs = await this.repoFacade.eventCardLog.search({ cardId: result.id }, 1, 100);

    return mapToDetail(result, logs.items);
  }
}

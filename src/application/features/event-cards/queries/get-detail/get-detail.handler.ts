import { REPO_FACADE } from "@/src/common/tokens";
import { NotFoundException } from "@/src/domain/exceptions";
import { RepositoryFacade } from "@/src/infrastracture/repositories";
import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { EventCardDto } from "../../dtos";
import { mapToDetail } from "../../mapping/event-card.mapping";
import { GetEventCardDetailQuery } from "./get-detail.query";

@QueryHandler(GetEventCardDetailQuery)
export class GetEventCardDetailHandler implements IQueryHandler<GetEventCardDetailQuery, EventCardDto> {
  constructor(
    @Inject(REPO_FACADE) private readonly repoFacade: RepositoryFacade
  ) { }

  async execute(request: GetEventCardDetailQuery): Promise<EventCardDto> {
    // Get event card detail
    const result = await this.repoFacade.eventCard.getById(request.cardId);
    if (!result) throw NotFoundException.create('eventId', request.cardId);

    // Get event card logs
    const logs = await this.repoFacade.eventCardLog.search({ cardId: request.cardId }, 1, 100);

    return mapToDetail(result, logs.items);
  }
}

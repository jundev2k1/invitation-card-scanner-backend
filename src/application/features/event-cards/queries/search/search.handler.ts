import { PaginatedResult } from "@/src/application/common";
import { REPO_FACADE } from "@/src/common/tokens";
import { RepositoryFacade } from "@/src/infrastracture/repositories";
import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { EventCardtSearchItemDto } from "../../dtos/event-card-search-item.dto";
import { mapToSearchResultSummary } from "../../mapping/event-card.mapping";
import { SearchEventCardsQuery } from "./search.query";

@QueryHandler(SearchEventCardsQuery)
export class SearchEventCardsHandler
  implements IQueryHandler<SearchEventCardsQuery, PaginatedResult<EventCardtSearchItemDto>> {
    
  constructor(
    @Inject(REPO_FACADE) private readonly repoFacade: RepositoryFacade
  ) { }

  async execute(request: SearchEventCardsQuery): Promise<PaginatedResult<EventCardtSearchItemDto>> {
    const result = await this.repoFacade.eventCard.getsByEventId(
      request.eventId,
      request.keyword,
      request.page,
      request.pageSize
    );

    return mapToSearchResultSummary(result);
  }
}

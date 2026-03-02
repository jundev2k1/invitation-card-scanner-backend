import { REPO_FACADE } from "@/src/common/tokens";
import { RepositoryFacade } from "@/src/infrastracture/repositories";
import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { EventCategorySummaryDto } from "../../dtos/event-category-summary.dto";
import { GetEventCategorySuggestionsQuery } from "./get-category-suggestions.query";

@QueryHandler(GetEventCategorySuggestionsQuery)
export class GetEventCategorySuggestionsHandler implements IQueryHandler<GetEventCategorySuggestionsQuery, EventCategorySummaryDto[]> {
  constructor(
    @Inject(REPO_FACADE) private readonly repoFacade: RepositoryFacade
  ) { }

  async execute(query: GetEventCategorySuggestionsQuery): Promise<EventCategorySummaryDto[]> {
    return await this.repoFacade.eventCategory.getSuggestions(query.keyword, query.pageSize);
  }
}

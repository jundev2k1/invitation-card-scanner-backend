import { PaginatedResult } from "@/src/application/common";
import { REPO_FACADE } from "@/src/common/tokens";
import { RepositoryFacade } from "@/src/infrastracture/repositories";
import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { EventSearchItem } from "../../dtos";
import { SearchEventQuery, SearchEventRequest } from "./search.query";

@QueryHandler(SearchEventQuery)
export class SearchEventHandler implements IQueryHandler<SearchEventQuery, PaginatedResult<EventSearchItem>> {
  constructor(
    @Inject(REPO_FACADE) private readonly repoFacade: RepositoryFacade
  ) { }

  async execute(request: SearchEventRequest): Promise<PaginatedResult<EventSearchItem>> {
    return await this.repoFacade.event.searchByKeyword(
      request.keyword || '',
      request.page || 1,
      request.pageSize || 20
    );
  }
}
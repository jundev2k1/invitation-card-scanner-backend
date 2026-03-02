import { PaginatedResult } from "@/src/application/common";
import { REPO_FACADE } from "@/src/common/tokens";
import { RepositoryFacade } from "@/src/infrastracture/repositories";
import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { EventSearchItem } from "../../dtos";
import { SearchEventQuery } from "./search.query";

@QueryHandler(SearchEventQuery)
export class SearchEventHandler implements IQueryHandler<SearchEventQuery, PaginatedResult<EventSearchItem>> {
  constructor(
    @Inject(REPO_FACADE) private readonly repoFacade: RepositoryFacade
  ) { }

  async execute({
    keyword,
    statuses,
    categories,
    startFrom,
    startTo,
    endFrom,
    endTo,
    sortBy,
    sortOrder,
    page,
    pageSize,
  }: SearchEventQuery): Promise<PaginatedResult<EventSearchItem>> {
    return await this.repoFacade.event.searchByKeyword(
      keyword || '',
      statuses || [],
      categories || [],
      startFrom,
      startTo,
      endFrom,
      endTo,
      sortBy || 'created_at',
      sortOrder || 'desc',
      page,
      pageSize
    );
  }
}
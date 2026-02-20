import { REPO_FACADE } from "@/src/common/tokens";
import { RepositoryFacade } from "@/src/infrastracture/repositories";
import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { EventCategoryNode } from "../../dtos";
import { mapCategoriesTree } from "../../mapping";
import { SearchCategoriesQuery } from "./search.query";

@QueryHandler(SearchCategoriesQuery)
export class SearchCategoriesHandler implements IQueryHandler<SearchCategoriesQuery, EventCategoryNode[]> {
  constructor(
    @Inject(REPO_FACADE) private readonly repoFacade: RepositoryFacade
  ) { }

  async execute(request: SearchCategoriesQuery) {
    const result = await this.repoFacade.eventCategory.search(
      request.parentId,
      request.cateId,
      request.keyword
    );
    return mapCategoriesTree(result);
  }
}

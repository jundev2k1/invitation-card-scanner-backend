import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PaginatedResult } from "src/application/common";
import { REPO_FACADE } from "src/common/tokens";
import { RepositoryFacade } from "src/infrastracture/repositories";
import { UserSearchItem } from "../../dtos";
import { GetUserListQuery } from "./get-user-list.query";

@QueryHandler(GetUserListQuery)
export class GetUserListHandler implements IQueryHandler<GetUserListQuery, PaginatedResult<UserSearchItem>> {
  constructor(
    @Inject(REPO_FACADE) private readonly repoFacade: RepositoryFacade
  ) { }

  async execute({
    keyword,
    statuses,
    sortBy,
    sortOrder,
    page,
    pageSize,
  }: GetUserListQuery): Promise<PaginatedResult<UserSearchItem>> {

    return await this.repoFacade.user
      .search(keyword, statuses, sortBy, sortOrder, page, pageSize);
  }
}

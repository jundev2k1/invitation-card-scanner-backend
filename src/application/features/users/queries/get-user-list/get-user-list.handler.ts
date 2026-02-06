import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PaginatedResult } from "src/application/common";
import { REPO_FACADE } from "src/common/tokens";
import { RepositoryFacade } from "src/infrastracture/repositories";
import { UserSearchItem } from "../../dtos/user-search-item.dto";
import { GetUserListQuery } from "./get-user-list.query";

@QueryHandler(GetUserListQuery)
export class GetUserListHandler implements IQueryHandler<GetUserListQuery, PaginatedResult<UserSearchItem>> {
  constructor(
    @Inject(REPO_FACADE) private readonly repoFacade: RepositoryFacade
  ) { }

  async execute(request: GetUserListQuery): Promise<PaginatedResult<UserSearchItem>> {
    const { keyword, page, pageSize } = request;

    return await this.repoFacade.user
      .search(keyword, page, pageSize);
  }
}

import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PaginatedResult } from "src/application/common";
import { USER_REPO } from "src/common/tokens";
import { UserRepo } from "src/infrastracture/repositories";
import { UserSearchItem } from "../../dtos/user-search-item";
import { GetUserListQuery } from "./get-user-list.query";

@QueryHandler(GetUserListQuery)
export class GetUserListHandler implements IQueryHandler<GetUserListQuery, PaginatedResult<UserSearchItem>> {
  constructor(
    @Inject(USER_REPO) private readonly userRepo: UserRepo
  ) { }

  async execute(request: GetUserListQuery): Promise<PaginatedResult<UserSearchItem>> {
    const { keyword, page, pageSize } = request;
    return await this.userRepo.search(keyword, page, pageSize);
  }
}

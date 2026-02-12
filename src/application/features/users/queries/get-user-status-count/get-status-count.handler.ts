import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { REPO_FACADE } from "src/common/tokens";
import { UserStatus } from "src/domain/enums";
import { RepositoryFacade } from "src/infrastracture/repositories";
import { GetUserStatusCountQuery } from "./get-status-count.query";

@QueryHandler(GetUserStatusCountQuery)
export class GetUserStatusCountHandler implements IQueryHandler<GetUserStatusCountQuery, Record<UserStatus, number>> {
  constructor(
    @Inject(REPO_FACADE) private readonly repoFacade: RepositoryFacade
  ) { }

  async execute(): Promise<Record<UserStatus, number>> {
    const result = await this.repoFacade.user.getUserStatusCount();
    return result.reduce(
      (prev, [status, count]) => { prev[status] = count; return prev },
      {}) as Record<UserStatus, number>;
  }
}
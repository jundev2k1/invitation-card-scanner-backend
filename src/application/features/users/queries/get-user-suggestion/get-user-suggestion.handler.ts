import { REPO_FACADE } from "@/src/common/tokens";
import { RepositoryFacade } from "@/src/infrastracture/repositories";
import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { UserSummaryDto } from "../../dtos";
import { GetUserSuggestionQuery } from "./get-user-suggestion.query";

@QueryHandler(GetUserSuggestionQuery)
export class GetUserSuggestionHandler implements IQueryHandler<GetUserSuggestionQuery, UserSummaryDto[]> {
  constructor(
    @Inject(REPO_FACADE) private readonly repoFacade: RepositoryFacade
  ) { }

  async execute(query: GetUserSuggestionQuery): Promise<UserSummaryDto[]> {
    return await this.repoFacade.user.getUserSuggestions(query.keyword, query.roles, query.pageSize);
  }
}

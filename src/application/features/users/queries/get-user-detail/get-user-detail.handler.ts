import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { REPO_FACADE } from "src/common/tokens";
import { NotFoundException } from "src/domain/exceptions";
import { RepositoryFacade } from "src/infrastracture/repositories";
import { UserDetailDto } from "../../dtos/user-detail.dto";
import { mapToUserDetail } from "../../mapping";
import { GetUserDetailQuery } from "./get-user-detail.query";

@QueryHandler(GetUserDetailQuery)
export class GetUserDetailHandler implements IQueryHandler<GetUserDetailQuery, UserDetailDto> {
  constructor(
    @Inject(REPO_FACADE) private readonly repoFacade: RepositoryFacade
  ) { }

  async execute(request: GetUserDetailQuery): Promise<UserDetailDto> {
    const userId = request.userId;
    const user = await this.repoFacade.user.getById(userId);
    if (!user) throw NotFoundException.create('userId', userId);

    return mapToUserDetail(user);
  }
}

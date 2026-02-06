import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BadRequestException } from "src/application/common";
import { ApiMessages } from "src/common/constants";
import { REPO_FACADE } from "src/common/tokens";
import { UserStatus } from "src/domain/enums";
import { NotFoundException } from "src/domain/exceptions";
import { RepositoryFacade } from "src/infrastracture/repositories";
import { ApproveUserCommand } from "./approve-user.command";

@CommandHandler(ApproveUserCommand)
export class ApproveUserHandler implements ICommandHandler<ApproveUserCommand> {
  constructor(
    @Inject(REPO_FACADE) private readonly repoFacade: RepositoryFacade
  ) { }

  async execute(request: ApproveUserCommand) {
    const user = await this.repoFacade.user.getById(request.userId);
    if (!user) throw NotFoundException.create('userId', request.userId);

    if (user.status !== UserStatus.WAITING_FOR_APPROVE)
      throw BadRequestException.create(ApiMessages.INVALID_STATE);

    user.approveUser();
    await this.repoFacade.user.update(user);
  }
}

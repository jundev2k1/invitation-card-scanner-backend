import { REPO_FACADE } from "@/src/common/tokens";
import { RepositoryFacade } from "@/src/infrastracture/repositories";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateMemberInfoCommand } from "./update-info.command";

@CommandHandler(UpdateMemberInfoCommand)
export class UpdateMemberInfoHandler implements ICommandHandler<UpdateMemberInfoCommand> {
  constructor(
    @Inject(REPO_FACADE) private readonly repoFacade: RepositoryFacade
  ) { }

  async execute(request: UpdateMemberInfoCommand) {
    await this.repoFacade.eventMember.updateInfo(
      request.id,
      request.assignedRole
    );
  }
}

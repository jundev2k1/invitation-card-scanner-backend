import { REPO_FACADE } from "@/src/common/tokens";
import { RepositoryFacade } from "@/src/infrastracture/repositories";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RemoveMemberCommand } from "./remove-member.command";

@CommandHandler(RemoveMemberCommand)
export class RemoveMemberHandler implements ICommandHandler<RemoveMemberCommand> {
  constructor(
    @Inject(REPO_FACADE) private readonly repoFacade: RepositoryFacade
  ) { }

  async execute(request: RemoveMemberCommand) {
    await this.repoFacade.eventMember.removeMember(request.id);
  }
}

import { BadRequestException } from "@/src/application/common";
import { ApiMessages } from "@/src/common/constants";
import { REPO_FACADE } from "@/src/common/tokens";
import { NotFoundException } from "@/src/domain/exceptions";
import { RepositoryFacade } from "@/src/infrastracture/repositories";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AssignMemberCommand } from "./assign-member.command";

@CommandHandler(AssignMemberCommand)
export class AssignMemberHandler implements ICommandHandler<AssignMemberCommand> {
  constructor(
    @Inject(REPO_FACADE) private readonly repoFacade: RepositoryFacade
  ) { }

  async execute(request: AssignMemberCommand) {
    const isExistEvent = await this.repoFacade.event.getById(request.eventId);
    if (!isExistEvent) throw NotFoundException.create("eventId", request.eventId);

    const isExistMember = await this.repoFacade.eventMember.isExistMember(request.eventId, request.userId);
    if (isExistMember) throw BadRequestException.create(ApiMessages.CONFLICT);

    await this.repoFacade.eventMember.addMember(
      request.eventId,
      request.userId,
      request.assignedRole.trim()
    );
  }
}

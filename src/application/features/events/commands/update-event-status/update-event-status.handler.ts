import { REPO_FACADE, UNIT_OF_WORK } from "@/src/common/tokens";
import { UnitOfWork } from "@/src/infrastracture/database";
import { RepositoryFacade } from "@/src/infrastracture/repositories";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateEventStatusCommand } from "./update-event-status.command";

@CommandHandler(UpdateEventStatusCommand)
export class UpdateEventStatusHandler implements ICommandHandler<UpdateEventStatusCommand> {
  constructor(
    @Inject(UNIT_OF_WORK) private readonly unitOfWork: UnitOfWork,
    @Inject(REPO_FACADE) private readonly repoFacade: RepositoryFacade
  ) { }

  async execute(request: UpdateEventStatusCommand): Promise<void> {
    await this.unitOfWork.withTransaction(async () => {
      await this.repoFacade.event.updateStatus(request.eventId, request.status);
    });
  }
}

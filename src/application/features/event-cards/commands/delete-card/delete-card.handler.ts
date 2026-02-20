import { BadRequestException } from "@/src/application/common";
import { ApiMessages } from "@/src/common/constants";
import { REPO_FACADE, UNIT_OF_WORK } from "@/src/common/tokens";
import { NotFoundException } from "@/src/domain/exceptions";
import { UnitOfWork } from "@/src/infrastracture/database";
import { RepositoryFacade } from "@/src/infrastracture/repositories";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteEventCardCommand } from "./delete-card.command";

@CommandHandler(DeleteEventCardCommand)
export class DeleteEventCardHandler implements ICommandHandler<DeleteEventCardCommand> {
  constructor(
    @Inject(UNIT_OF_WORK) private readonly unitOfWork: UnitOfWork,
    @Inject(REPO_FACADE) private readonly repoFacade: RepositoryFacade
  ) { }

  async execute(request: DeleteEventCardCommand): Promise<void> {
    // Check if event card exists
    const eventCard = await this.repoFacade.eventCard.getById(request.cardId);
    if (!eventCard) throw NotFoundException.create('eventId', request.cardId);

    if (eventCard.eventId !== request.eventId)
      throw BadRequestException.create(ApiMessages.INVALID_PARAMETER);

    // Delete event card
    await this.unitOfWork.withTransaction(async () => {
      await this.repoFacade.eventCard.delete(request.cardId);
    });
  }
}
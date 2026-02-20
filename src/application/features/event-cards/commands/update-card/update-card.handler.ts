import { REPO_FACADE, UNIT_OF_WORK } from "@/src/common/tokens";
import { NotFoundException } from "@/src/domain/exceptions";
import { UnitOfWork } from "@/src/infrastracture/database";
import { RepositoryFacade } from "@/src/infrastracture/repositories";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateEventCardCommand } from "./update-card.command";

@CommandHandler(UpdateEventCardCommand)
export class UpdateEventCardHandler implements ICommandHandler<UpdateEventCardCommand> {
  constructor(
    @Inject(UNIT_OF_WORK) private readonly unitOfWork: UnitOfWork,
    @Inject(REPO_FACADE) private readonly repoFacade: RepositoryFacade
  ) { }

  async execute(request: UpdateEventCardCommand): Promise<any> {
    // Check if event card exists
    const eventCard = await this.repoFacade.eventCard.getById(request.cardId);
    if (!eventCard) throw NotFoundException.create('eventId', request.cardId);

    // Check if event id matches
    if (eventCard.eventId !== request.eventId)
      throw NotFoundException.create('eventId', request.eventId);

    // Update event card
    eventCard.updateCardInfo(request.guestName, request.notes);
    await this.unitOfWork.withTransaction(async () => {
      await this.repoFacade.eventCard.update(eventCard);
    });
  }
}

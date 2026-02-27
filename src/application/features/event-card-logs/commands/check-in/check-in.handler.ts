import { REPO_FACADE, UNIT_OF_WORK } from "@/src/common/tokens";
import { EventCardLog } from "@/src/domain/entities";
import { EventCardStatus } from "@/src/domain/enums";
import { NotFoundException } from "@/src/domain/exceptions";
import { UnitOfWork } from "@/src/infrastracture/database";
import { RepositoryFacade } from "@/src/infrastracture/repositories";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CheckInCardCommand } from "./check-in.command";

@CommandHandler(CheckInCardCommand)
export class CheckInCardHandler implements ICommandHandler<CheckInCardCommand> {
  constructor(
    @Inject(UNIT_OF_WORK) private readonly unitOfWork: UnitOfWork,
    @Inject(REPO_FACADE) private readonly repoFacade: RepositoryFacade
  ) { }

  async execute(request: CheckInCardCommand): Promise<void> {
    // Check if event card exists
    const eventCard = await this.repoFacade.eventCard.getById(request.cardId);
    if (!eventCard || eventCard.eventId !== request.eventId || eventCard.status === EventCardStatus.INACTIVE)
      throw NotFoundException.create('cardId', request.cardId);

    // Create event card log for event card
    const cardLog = EventCardLog.create({
      cardId: request.cardId,
      scannedBy: request.userId,
      notes: request.notes.trim()
    });
    await this.unitOfWork.withTransaction(async () => {
      await this.repoFacade.eventCardLog.create(cardLog);
    });
  }
}

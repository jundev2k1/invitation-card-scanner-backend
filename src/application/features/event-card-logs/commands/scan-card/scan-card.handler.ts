import { REPO_FACADE, UNIT_OF_WORK, USER_ACCESSOR } from "@/src/common/tokens";
import { EventCardLog } from "@/src/domain/entities";
import { EventCardStatus } from "@/src/domain/enums";
import { NotFoundException } from "@/src/domain/exceptions";
import { UnitOfWork } from "@/src/infrastracture/database";
import { RepositoryFacade } from "@/src/infrastracture/repositories";
import { UserAccessor } from "@/src/infrastracture/security";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ScanCardCommand } from "./scan-card.command";

@CommandHandler(ScanCardCommand)
export class ScanCardHandler implements ICommandHandler<ScanCardCommand> {
  constructor(
    @Inject(USER_ACCESSOR) private readonly userAccessor: UserAccessor,
    @Inject(UNIT_OF_WORK) private readonly unitOfWork: UnitOfWork,
    @Inject(REPO_FACADE) private readonly repoFacade: RepositoryFacade
  ) { }

  async execute(request: ScanCardCommand): Promise<void> {
    // Check if event card exists
    const eventCard = await this.repoFacade.eventCard.getById(request.cardId);
    if (!eventCard || eventCard.eventId !== request.eventId || eventCard.status === EventCardStatus.INACTIVE)
      throw NotFoundException.create('cardId', request.cardId);

    // Create event card log for event card
    const cardLog = EventCardLog.create({
      cardId: request.cardId,
      scannedBy: this.userAccessor.userId.toString(),
      notes: request.notes.trim()
    });
    await this.unitOfWork.withTransaction(async () => {
      await this.repoFacade.eventCardLog.create(cardLog);
    })
  }
}

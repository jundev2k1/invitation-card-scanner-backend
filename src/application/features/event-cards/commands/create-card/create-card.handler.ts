import { REPO_FACADE, UNIT_OF_WORK } from "@/src/common/tokens";
import { EventCard } from "@/src/domain/entities";
import { NotFoundException } from "@/src/domain/exceptions";
import { UnitOfWork } from "@/src/infrastracture/database";
import { RepositoryFacade } from "@/src/infrastracture/repositories";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateEventCardCommand } from "./create-card.command";

@CommandHandler(CreateEventCardCommand)
export class CreateEventCardHandler implements ICommandHandler<CreateEventCardCommand> {
  constructor(
    @Inject(UNIT_OF_WORK) private readonly unitOfWork: UnitOfWork,
    @Inject(REPO_FACADE) private readonly repoFacade: RepositoryFacade
  ) { }

  async execute(request: CreateEventCardCommand): Promise<void> {
    // Check if event exists
    const event = await this.repoFacade.event.getById(request.eventId);
    if (!event) throw NotFoundException.create('eventId', request.eventId);

    // Create event card
    const eventCard = EventCard.create({
      eventId: request.eventId,
      guestName: request.guestName,
      notes: request.notes
    });
    await this.unitOfWork.withTransaction(async () => {
      await this.repoFacade.eventCard.create(eventCard);
    });
  }
}

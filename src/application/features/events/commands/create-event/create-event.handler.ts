import { REPO_FACADE, UNIT_OF_WORK } from "@/src/common/tokens";
import { Event } from "@/src/domain/entities";
import { EventStatus } from "@/src/domain/enums";
import { UnitOfWork } from "@/src/infrastracture/database";
import { RepositoryFacade } from "@/src/infrastracture/repositories";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateEventCommand } from "./create-event.command";

@CommandHandler(CreateEventCommand)
export class CreateEventHandler implements ICommandHandler<CreateEventCommand> {
  constructor(
    @Inject(UNIT_OF_WORK) private readonly unitOfWork: UnitOfWork,
    @Inject(REPO_FACADE) private readonly repoFacade: RepositoryFacade
  ) { }

  async execute(request: CreateEventCommand): Promise<void> {
    const eventEntity = Event.create({
      categoryId: request.categoryId || null,
      title: request.title,
      startAt: request.startAt,
      endAt: request.endAt,
      description: request.description,
      locationName: request.locationName,
      address: request.address,
      mapUrl: request.mapUrl,
      thumbnailUrl: request.thumbnailUrl
    });
    switch (request.status) {
      case EventStatus.PUBLISHED: eventEntity.publish(); break;
      case EventStatus.COMPLETED: eventEntity.complete(); break;
      case EventStatus.CANCELLED: eventEntity.cancel(); break;
    }
    await this.unitOfWork.withTransaction(async () => {
      await this.repoFacade.event.create(eventEntity);
    });
  }
}

import { REPO_FACADE, UNIT_OF_WORK } from "@/src/common/tokens";
import { EventStatus } from "@/src/domain/enums";
import { NotFoundException } from "@/src/domain/exceptions";
import { UnitOfWork } from "@/src/infrastracture/database";
import { RepositoryFacade } from "@/src/infrastracture/repositories";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateEventCommand } from "./update-event.command";

@CommandHandler(UpdateEventCommand)
export class UpdateEventHandler implements ICommandHandler<UpdateEventCommand> {
  constructor(
    @Inject(UNIT_OF_WORK) private readonly unitOfWork: UnitOfWork,
    @Inject(REPO_FACADE) private readonly repoFacade: RepositoryFacade
  ) { }

  async execute(request: UpdateEventCommand): Promise<void> {
    const targetEvent = await this.repoFacade.event.getById(request.id);
    if (!targetEvent) throw NotFoundException.create("id", request.id);

    await this.unitOfWork.withTransaction(async () => {
      targetEvent.updateBasicInfo(
        request.title,
        request.description,
        targetEvent.thumbnailUrl
      );
      targetEvent.updateCategory(request.categoryId);
      targetEvent.updateLocation(
        request.locationName,
        request.address,
        request.mapUrl
      );
      targetEvent.reschedule(request.startAt, request.endAt);
      switch (request.status) {
        case EventStatus.PUBLISHED: targetEvent.publish(); break;
        case EventStatus.COMPLETED: targetEvent.complete(); break;
        case EventStatus.CANCELLED: targetEvent.cancel(); break;
      }
      targetEvent.updateUpdatedAt();
      await this.repoFacade.event.update(targetEvent);
    });
  }
}

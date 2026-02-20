import { REPO_FACADE } from "@/src/common/tokens";
import { NotFoundException } from "@/src/domain/exceptions";
import { RepositoryFacade } from "@/src/infrastracture/repositories";
import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { EventDetailDto } from "../../dtos";
import { GetEventDetailQuery } from "./get-detail.query";

@QueryHandler(GetEventDetailQuery)
export class GetEventDetailHandler implements IQueryHandler<GetEventDetailQuery, EventDetailDto> {
  constructor(
    @Inject(REPO_FACADE) private readonly repoFacade: RepositoryFacade
  ) { }

  async execute(request: GetEventDetailQuery): Promise<EventDetailDto> {
    const event = await this.repoFacade.event.getById(request.eventId);
    if (!event) throw NotFoundException.create('eventId', request.eventId);

    return new EventDetailDto(
      event.id,
      event.categoryId?.value || null,
      event.title,
      event.description,
      event.startAt,
      event.endAt,
      event.locationName,
      event.address,
      event.mapUrl,
      event.thumbnailUrl,
      event.status,
      "{}",
      event.createdAt,
      event.updatedAt
    );
  }
}
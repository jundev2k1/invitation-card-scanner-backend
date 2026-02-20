import { PaginatedResult } from "@/src/application/common";
import { EventCard } from "@/src/domain/entities";
import { EventCardDto } from "../dtos";
import { EventCardtSearchItemDto } from "../dtos/event-card-search-item.dto";

export function mapToSearchResultSummary(
  input: PaginatedResult<EventCardDto>): PaginatedResult<EventCardtSearchItemDto> {
  return new PaginatedResult<EventCardtSearchItemDto>(
    input.items.map(i =>
      new EventCardtSearchItemDto(
        i.id,
        i.guestName,
        i.status,
        i.notes || '',
        i.createdAt,
        i.updatedAt
      )
    ),
    input.totalCount,
    input.totalCount,
    input.totalPage,
    input.page,
    input.pageSize
  );
}

export function mapToDetail(input: EventCard): EventCardDto {
  return new EventCardDto(
    input.id,
    input.eventId,
    input.guestName,
    input.accessToken,
    input.isUsed,
    input.firstScannedAt,
    input.status,
    input.notes,
    input.createdAt,
    input.updatedAt
  );
}

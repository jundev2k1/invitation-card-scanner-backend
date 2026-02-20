import { PaginatedResult } from "@/src/application/common";
import { EventCardDto } from "@/src/application/features/event-cards/dtos";
import { EventCard } from "@/src/domain/entities";

export const mapToEventCardSearchResult = (
  data: readonly any[],
  page: number,
  pageSize: number
): PaginatedResult<EventCardDto> => {
  const items = data.map(i => new EventCardDto(
    i.id,
    i.event_id,
    i.guest_name,
    i.access_token,
    i.is_used,
    i.first_scanned_at ? new Date(i.first_scanned_at) : null,
    i.status,
    i.notes,
    new Date(i.created_at),
    new Date(i.updated_at),
  ));

  const totalCount = data.length > 0 ? Number(data[0].total_count) : 0;

  return new PaginatedResult(
    items,
    items.length,
    totalCount,
    Math.ceil(totalCount / pageSize),
    page,
    pageSize
  );
};

export function mapToEventCardEntity(data: any): EventCard {
  return new EventCard(
    data.id,
    data.event_id,
    data.guest_name,
    data.access_token,
    data.is_used,
    data.first_scanned_at ? new Date(data.first_scanned_at) : null,
    data.status,
    data.notes,
    new Date(data.created_at),
    new Date(data.updated_at)
  );
}

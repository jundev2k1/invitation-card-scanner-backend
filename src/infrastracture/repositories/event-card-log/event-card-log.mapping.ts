import { PaginatedResult } from "@/src/application/common";
import { EventCardLogDto } from "@/src/application/features/event-card-logs/dtos";
import { UserSummaryDto } from "@/src/application/features/users/dtos";

export const mapToEventCardLogSearchResult = (
  data: readonly any[],
  page: number,
  pageSize: number
): PaginatedResult<EventCardLogDto> => {
  const items = data.map(i => new EventCardLogDto(
    i.id,
    i.card_id,
    new UserSummaryDto(
      i.scanned_by_id,
      i.scanned_by_nickname,
      i.scanned_by_email,
      i.scanned_by_phone_number,
      i.scanned_by_avatar_url
    ),
    new Date(i.scanned_at),
    i.notes,
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
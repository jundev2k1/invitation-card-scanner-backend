import { PaginatedResult } from "@/src/application/common";
import { EventMemberDto } from "@/src/application/features/event-members/dtos";

export const mapToEventMemberSearchResult = (
  data: readonly any[],
  page: number,
  pageSize: number
): PaginatedResult<EventMemberDto> => {
  const items = data.map(i => new EventMemberDto(
    i.id,
    i.event_id,
    i.user_id,
    i.nickname,
    i.email,
    i.phone_number,
    i.avatar_url,
    i.assigned_role,
    new Date(i.assigned_at),
  ));
  const totalCount = data.length > 0 ? Number(data[0].total_count) : 0;
  return new PaginatedResult(
    items,
    items.length,
    totalCount,
    Math.ceil(totalCount / pageSize),
    page, pageSize
  );
};

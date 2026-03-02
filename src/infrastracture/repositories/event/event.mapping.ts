import { EventDetailDto } from "@/src/application/features/events/dtos/event-detail.dto";
import { Event } from "@/src/domain/entities";
import { CategoryId } from "@/src/domain/value-objects";
import { PaginatedResult } from "src/application/common";
import { EventDetailStatsDto, EventSearchItem } from "src/application/features/events/dtos";

export const mapToEventSearchResult = (
  data: readonly any[],
  page: number,
  pageSize: number
): PaginatedResult<EventSearchItem> => {

  const items = data.map(i => new EventSearchItem(
    i.id,
    i.category_id,
    i.title,
    new Date(i.start_at),
    i.end_at ? new Date(i.end_at) : null,
    i.location_name,
    i.address,
    i.map_url,
    i.thumbnail_url,
    i.status,
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

export const mapToDetail = (data: any): EventDetailDto => {
  return new EventDetailDto(
    data.id,
    data.category_id || null,
    data.category_name || null,
    data.category_slug || null,
    data.title,
    data.description,
    new Date(data.start_at),
    data.end_at ? new Date(data.end_at) : null,
    data.location_name,
    data.address,
    data.map_url,
    data.thumbnail_url,
    data.status,
    data.settings,
    new Date(data.created_at),
    new Date(data.updated_at),
  )
}

export const mapToEventEntity = (data: any): Event => {
  return new Event(
    data.id,
    data.category_id ? CategoryId.of(data.category_id) : null,
    data.title,
    data.description,
    new Date(data.start_at),
    data.end_at ? new Date(data.end_at) : null,
    data.location_name,
    data.address,
    data.map_url,
    data.thumbnail_url,
    data.status,
    new Date(data.created_at),
    new Date(data.updated_at)
  );
}

export const mapToEventDetailStats = (data: any): EventDetailStatsDto => {
  return new EventDetailStatsDto(
    data.id,
    {
      totalCards: Number(data.total_card_count),
      availableCards: Number(data.available_card_count),
      usedCards: Number(data.used_card_count)
    },
    {
      totalMembers: Number(data.total_member_count),
    }
  );
}

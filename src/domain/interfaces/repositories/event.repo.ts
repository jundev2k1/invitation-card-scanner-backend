import { EventDetailDto, EventDetailStatsDto, EventSearchItem } from "@/src/application/features/events/dtos";
import { PaginatedResult } from "src/application/common";
import { Event } from "src/domain/entities";
import { EventStatus } from "../../enums";
import { CategoryId } from "../../value-objects";

export interface IEventRepo {
  searchByKeyword(
    keyword: string,
    statuses: EventStatus[],
    categories: CategoryId[],
    startFrom: Date | null,
    startEnd: Date | null,
    endFrom: Date | null,
    endTo: Date | null,
    sortBy: string,
    sortOrder: string,
    page: number,
    pageSize: number
  ): Promise<PaginatedResult<EventSearchItem>>;

  searchByCategory(
    categoryId: string,
    offset: number,
    limit: number
  ): Promise<PaginatedResult<EventSearchItem>>;

  getStatsById(id: string): Promise<EventDetailStatsDto>;

  getDetailById(id: string): Promise<EventDetailDto | null>

  getById(id: string): Promise<Event | null>;

  create(input: Event): Promise<void>;

  update(input: Event): Promise<void>;

  updateStatus(id: string, status: EventStatus): Promise<void>;

  delete(id: string): Promise<void>;
}

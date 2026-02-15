import { EventSearchItem } from "@/src/application/features/events/dtos";
import { EventDetailDto } from "@/src/application/features/events/dtos/event-detail.dto";
import { PaginatedResult } from "src/application/common";
import { Event } from "src/domain/entities";

export interface IEventRepo {
  searchByKeyword(
    keyword: string,
    offset: number,
    limit: number
  ): Promise<PaginatedResult<EventSearchItem>>;

  searchByCategory(
    categoryId: string,
    offset: number,
    limit: number
  ): Promise<PaginatedResult<EventSearchItem>>;

  findById(id: string): Promise<EventDetailDto | null>;

  create(input: Event): Promise<void>;

  update(input: Event): Promise<void>;

  delete(id: string): Promise<void>;
}

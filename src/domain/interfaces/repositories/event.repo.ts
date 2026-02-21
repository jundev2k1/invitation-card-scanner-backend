import { EventSearchItem } from "@/src/application/features/events/dtos";
import { PaginatedResult } from "src/application/common";
import { Event } from "src/domain/entities";
import { EventStatus } from "../../enums";

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

  getById(id: string): Promise<Event | null>;

  create(input: Event): Promise<void>;

  update(input: Event): Promise<void>;

  updateStatus(id: string, status: EventStatus): Promise<void>;

  delete(id: string): Promise<void>;
}

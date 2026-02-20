import { PaginatedResult } from "@/src/application/common";
import { EventCardDto } from "@/src/application/features/event-cards/dtos";
import { EventCard } from "../../entities";

export interface IEventCardRepo {
  getsByEventId(eventId: string, keyword: string, page: number, pageSize: number): Promise<PaginatedResult<EventCardDto>>;

  getById(id: string): Promise<EventCard | null>;

  create(eventCard: EventCard): Promise<void>;

  update(eventCard: EventCard): Promise<void>;

  delete(id: string): Promise<void>;
}

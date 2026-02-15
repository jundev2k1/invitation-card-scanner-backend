import { PaginatedResult } from "@/src/application/common";
import { EventCardLogDto } from "@/src/application/features/event-card-logs/dtos";
import { EventCardLog } from "../../entities";

export interface IEventCardLogRepo {

  search(
    params: {
      cardId?: string | null;
      scannedBy?: string | null;
      scannedFrom?: Date | null;
      scannedTo?: Date | null;
    },
    page: number,
    pageSize: number
  ): Promise<PaginatedResult<EventCardLogDto>>;

  create(eventCardLog: EventCardLog): Promise<void>;

  update(id: string, notes: string): Promise<void>;

  delete(id: string): Promise<void>;
}

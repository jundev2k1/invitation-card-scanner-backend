import { PaginatedResult } from "@/src/application/common";
import { EventCardDto } from "@/src/application/features/event-cards/dtos";
import { POSTGRES_POOL } from "@/src/common/tokens";
import { EventCard } from "@/src/domain/entities";
import { IEventCardRepo } from "@/src/domain/interfaces/repositories/event-card.repo";
import { Inject } from "@nestjs/common";
import { type DatabasePool, DatabaseTransactionConnection, sql } from "slonik";
import { transactionStorage } from "../../database";
import { mapToEventCardSearchResult } from "./event-card.mapping";

export class EventCardRepo implements IEventCardRepo {
  private get dbContext(): DatabaseTransactionConnection | DatabasePool {
    return transactionStorage.getStore() || this.pool;
  }

  constructor(
    @Inject(POSTGRES_POOL) private readonly pool: DatabasePool
  ) { }

  async getsByEventId(
    eventId: string,
    keyword: string | null,
    page: number,
    pageSize: number
  ): Promise<PaginatedResult<EventCardDto>> {
    const offset = (page - 1) * pageSize;
    const query = sql.unsafe`SELECT * FROM get_event_cards_by_event_id(
      ${eventId},
      ${keyword},
      ${offset},
      ${pageSize})`;
    const { rows } = await this.dbContext.query(query);
    return mapToEventCardSearchResult(rows, page, pageSize);
  }

  async create(eventCard: EventCard): Promise<void> {
    const query = sql.unsafe`SELECT create_event_card(
      ${eventCard.id},
      ${eventCard.eventId},
      ${eventCard.guestName},
      ${eventCard.accessToken},
      ${eventCard.isUsed},
      ${eventCard?.firstScannedAt?.toISOString() ?? null},
      ${eventCard.status},
      ${eventCard.notes},
      ${eventCard.createdAt.toISOString()}
    )`;
    await this.dbContext.query(query);
  }

  async update(eventCard: EventCard): Promise<void> {
    const query = sql.unsafe`SELECT update_event_card(
      ${eventCard.id},
      ${eventCard.eventId},    
      ${eventCard.guestName},
      ${eventCard.accessToken},
      ${eventCard.isUsed},
      ${eventCard?.firstScannedAt?.toISOString() ?? null},
      ${eventCard.status},
      ${eventCard.notes}
    )`;
    await this.dbContext.query(query);
  }

  async delete(id: string): Promise<void> {
    const query = sql.unsafe`SELECT delete_event_card(${id})`;
    await this.dbContext.query(query);
  }
}

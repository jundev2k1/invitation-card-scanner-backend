import { PaginatedResult } from '@/src/application/common';
import { EventCardLogDto } from '@/src/application/features/event-card-logs/dtos';
import { POSTGRES_POOL } from '@/src/common/tokens';
import { EventCardLog } from '@/src/domain/entities';
import { IEventCardLogRepo } from '@/src/domain/interfaces/repositories/event-card-log.repo';
import { Inject } from '@nestjs/common';
import { type DatabasePool, DatabaseTransactionConnection, sql } from 'slonik';
import { transactionStorage } from '../../database';
import { mapToEventCardLogSearchResult } from './event-card-log.mapping';

export class EventCardLogRepo implements IEventCardLogRepo {
  private get dbContext(): DatabaseTransactionConnection | DatabasePool {
    return transactionStorage.getStore() || this.pool;
  }

  constructor(
    @Inject(POSTGRES_POOL) private readonly pool: DatabasePool
  ) { }

  async search(
    params: {
      cardId?: string | null;
      scannedBy?: string | null;
      scannedFrom?: Date | null;
      scannedTo?: Date | null;
    },
    page: number,
    pageSize: number
  ): Promise<PaginatedResult<EventCardLogDto>> {
    const offset = (page - 1) * pageSize;
    const query = sql.unsafe`SELECT * FROM get_event_card_logs_by_criteria(
      ${params.cardId ?? null},
      ${params.scannedBy ?? null},
      ${params.scannedFrom?.toISOString() ?? null},
      ${params.scannedTo?.toISOString() ?? null},
      ${offset},
      ${pageSize})`;
    const { rows } = await this.dbContext.query(query);
    return mapToEventCardLogSearchResult(rows, page, pageSize);
  }

  async create(eventCardLog: EventCardLog): Promise<void> {
    const query = sql.unsafe`SELECT create_event_card_log(
      ${eventCardLog.id},
      ${eventCardLog.cardId},
      ${eventCardLog.scannedBy},
      ${eventCardLog.notes},
      ${eventCardLog.scannedAt.toISOString()}
    )`;
    await this.dbContext.query(query);
  }

  async update(
    id: string,
    notes: string
  ): Promise<void> {
    const query = sql.unsafe`SELECT update_event_card_log(
      ${id},
      ${notes})`;
    await this.dbContext.query(query);
  }

  async delete(id: string): Promise<void> {
    const query = sql.unsafe`SELECT delete_event_card_log(${id})`;
    await this.dbContext.query(query);
  }
}

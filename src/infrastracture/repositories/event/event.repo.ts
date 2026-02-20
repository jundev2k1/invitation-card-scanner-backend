import { PaginatedResult } from '@/src/application/common';
import { EventSearchItem } from '@/src/application/features/events/dtos';
import { POSTGRES_POOL } from '@/src/common/tokens';
import { Event } from '@/src/domain/entities';
import { IEventRepo } from '@/src/domain/interfaces/repositories/event.repo';
import { Inject } from '@nestjs/common';
import { type DatabasePool, DatabaseTransactionConnection, sql } from 'slonik';
import { transactionStorage } from '../../database';
import { mapToEventEntity, mapToEventSearchResult } from './event.mapping';

export class EventRepo implements IEventRepo {
  private get dbContext(): DatabaseTransactionConnection | DatabasePool {
    return transactionStorage.getStore() || this.pool;
  }

  constructor(
    @Inject(POSTGRES_POOL) private readonly pool: DatabasePool
  ) { }

  async searchByKeyword(
    keyword: string,
    page: number,
    pageSize: number
  ): Promise<PaginatedResult<EventSearchItem>> {
    const limit = (page - 1) * pageSize;

    const query = sql.unsafe`SELECT * FROM search_events_by_criteria(
      ${keyword},
      ${limit},
      ${pageSize})`;
    const { rows } = await this.dbContext.query(query);

    return mapToEventSearchResult(rows, page, pageSize);
  }

  async searchByCategory(
    categoryId: string,
    page: number,
    pageSize: number
  ): Promise<PaginatedResult<EventSearchItem>> {
    const limit = (page - 1) * pageSize;
    const query = sql.unsafe`SELECT * FROM search_events_by_category(${categoryId},${limit},${pageSize})`;
    const { rows } = await this.dbContext.query(query);

    return mapToEventSearchResult(rows, page, pageSize);
  }

  async getById(id: string): Promise<Event | null> {
    const query = sql.unsafe`SELECT * FROM get_event_by_id(${id})`;
    const { rows } = await this.dbContext.query(query);

    return rows.length > 0
      ? mapToEventEntity(rows[0])
      : null;
  }

  async create(params: Event): Promise<void> {
    const query = sql.unsafe`SELECT create_event(
      ${params.id},
      ${params.categoryId?.value ?? null},
      ${params.title},
      ${params.description},
      ${params.startAt.toISOString()},
      ${params.endAt?.toISOString() ?? null},
      ${params.locationName},
      ${params.address},
      ${params.mapUrl},
      ${params.thumbnailUrl},
      "{}",
      ${params.status})`;
    await this.dbContext.query(query);
  }

  async update(params: Event): Promise<void> {
    const query = sql.unsafe`SELECT update_event(
      ${params.id},
      ${params.categoryId?.value ?? null},
      ${params.title},
      ${params.description},
      ${params.startAt.toISOString()},
      ${params.endAt?.toISOString() ?? null},
      ${params.locationName},
      ${params.address},
      ${params.mapUrl},
      ${params.thumbnailUrl},
      "{}",
      ${params.status})`;
    await this.dbContext.query(query);
  }

  async delete(id: string): Promise<void> {
    const query = sql.unsafe`SELECT delete_event(${id})`;
    await this.dbContext.query(query);
  }
}

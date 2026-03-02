import { PaginatedResult } from '@/src/application/common';
import { EventDetailDto, EventDetailStatsDto, EventSearchItem } from '@/src/application/features/events/dtos';
import { POSTGRES_POOL } from '@/src/common/tokens';
import { Event } from '@/src/domain/entities';
import { EventStatus } from '@/src/domain/enums';
import { IEventRepo } from '@/src/domain/interfaces/repositories/event.repo';
import { CategoryId } from '@/src/domain/value-objects';
import { Inject } from '@nestjs/common';
import { type DatabasePool, DatabaseTransactionConnection, sql } from 'slonik';
import { transactionStorage } from '../../database';
import { mapToDetail, mapToEventDetailStats, mapToEventEntity, mapToEventSearchResult } from './event.mapping';

export class EventRepo implements IEventRepo {
  private get dbContext(): DatabaseTransactionConnection | DatabasePool {
    return transactionStorage.getStore() || this.pool;
  }

  constructor(
    @Inject(POSTGRES_POOL) private readonly pool: DatabasePool
  ) { }

  async searchByKeyword(
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
  ): Promise<PaginatedResult<EventSearchItem>> {
    const limit = (page - 1) * pageSize;

    const query = sql.unsafe`SELECT * FROM search_events_by_criteria(
      ${keyword},
      ${sql.array(categories.map(c => c.value), 'varchar')},
      ${sql.array(statuses, 'int2')},
      ${startFrom?.toISOString() ?? null},
      ${startEnd?.toISOString() ?? null},
      ${endFrom?.toISOString() ?? null},
      ${endTo?.toISOString() ?? null},
      ${sortBy},
      ${sortOrder},
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

  async getStatsById(id: string): Promise<EventDetailStatsDto> {
    const query = sql.unsafe`SELECT * FROM get_event_stats_by_id(${id})`;
    const { rows } = await this.dbContext.query(query);

    return mapToEventDetailStats(rows[0]);
  }

  async getDetailById(id: string): Promise<EventDetailDto | null> {
    const query = sql.unsafe`SELECT * FROM get_event_by_id(${id})`;
    const { rows } = await this.dbContext.query(query);

    return rows.length > 0
      ? mapToDetail(rows[0])
      : null;
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
      ${sql.jsonb({})},
      ${params.status}
    )`;
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
      ${sql.jsonb({})},
      ${params.status},
      ${params.updatedAt.toISOString()}
    )`;
    await this.dbContext.query(query);
  }

  async updateStatus(id: string, status: EventStatus): Promise<void> {
    const query = sql.unsafe`SELECT update_event_status(${id},${status})`;
    await this.dbContext.query(query);
  }

  async delete(id: string): Promise<void> {
    const query = sql.unsafe`SELECT delete_event(${id})`;
    await this.dbContext.query(query);
  }
}

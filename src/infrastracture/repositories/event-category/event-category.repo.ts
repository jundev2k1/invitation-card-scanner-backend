import { EventCategorySummaryDto } from "@/src/application/features/event-categories/dtos/event-category-summary.dto";
import { Inject, Injectable } from "@nestjs/common";
import { type DatabasePool, DatabaseTransactionConnection, sql } from "slonik";
import { POSTGRES_POOL } from "src/common/tokens";
import { EventCategory } from "src/domain/entities";
import { IEventCategoryRepo } from "src/domain/interfaces/repositories/event-category.repo";
import { transactionStorage } from "src/infrastracture/database";
import { mapToEventCategoryEntity, mapToEventCategorySummaries } from "./event-category.mapping";

@Injectable()
export class EventCategoryRepo implements IEventCategoryRepo {
  private get dbContext(): DatabaseTransactionConnection | DatabasePool {
    return transactionStorage.getStore() || this.pool;
  }

  constructor(
    @Inject(POSTGRES_POOL) private readonly pool: DatabasePool
  ) { }

  async search(parentId: string, cateId: string, keyword: string): Promise<EventCategory[]> {
    const query = sql.unsafe`
      SELECT * FROM search_event_categories(
        ${cateId || ''},
        ${parentId || ''},
        ${keyword || ''});
    `;

    const data = await this.dbContext.query(query);
    return data.rows.map(row => mapToEventCategoryEntity(row)!);
  }

  async getAllActive(): Promise<EventCategory[]> {
    const query = sql.unsafe`
      SELECT * FROM get_all_active_event_categories();
    `;

    const data = await this.dbContext.query(query);
    return data.rows.map(row => mapToEventCategoryEntity(row)!);
  }

  async getSuggestions(keyword: string, pageSize: number): Promise<EventCategorySummaryDto[]> {
    const query = sql.unsafe`
      SELECT * FROM get_event_category_suggestions(
        ${keyword},
        ${pageSize}
      );
    `;

    const { rows } = await this.dbContext.query(query);
    return mapToEventCategorySummaries(rows);
  }

  async getById(id: string): Promise<EventCategory | null> {
    const query = sql.unsafe`
      SELECT * FROM get_event_category_by_id(${id});
    `;

    const data = await this.dbContext.maybeOne(query);
    return data
      ? mapToEventCategoryEntity(data) :
      null;
  }

  async isExistParent(id: string): Promise<boolean> {
    const query = sql.unsafe`
      SELECT is_exist_parent_category(${id});
    `;

    return await this.dbContext.oneFirst(query);
  }

  async isExistId(id: string): Promise<boolean> {
    const query = sql.unsafe`
      SELECT is_exist_category(${id});
    `;

    return await this.dbContext.oneFirst(query);
  }

  async isExistSlug(slug: string): Promise<boolean> {
    const query = sql.unsafe`
      SELECT is_exist_category_by_slug(${slug});
    `;

    return await this.dbContext.oneFirst(query);
  }

  async create(entity: EventCategory): Promise<void> {
    const stored = sql.unsafe`
      SELECT create_event_category(
        ${entity.id.value},
        ${entity.parentId.value},
        ${entity.name},
        ${entity.slug},
        ${entity.description},
        ${entity.imageUrl},
        ${entity.status},
        ${entity.sortOrder},
        ${entity.level}
      );
    `;

    await this.dbContext.query(stored);
  }

  async update(entity: EventCategory): Promise<void> {
    const stored = sql.unsafe`
      SELECT update_event_category(
        ${entity.id.value},
        ${entity.name},
        ${entity.slug},
        ${entity.description},
        ${entity.imageUrl},
        ${entity.status},
        ${entity.sortOrder}
      );
    `;

    await this.dbContext.query(stored);
  }

  async delete(id: string): Promise<void> {
    const query = sql.unsafe`SELECT delete_event_category(${id})`;
    await this.dbContext.query(query);
  }
}

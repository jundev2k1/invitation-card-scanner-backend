import { Inject, Injectable } from "@nestjs/common";
import { type DatabasePool, DatabaseTransactionConnection, sql } from "slonik";
import { POSTGRES_POOL } from "src/common/tokens";
import { EventCategory } from "src/domain/entities";
import { IEventCategoryRepo } from "src/domain/interfaces/repositories/event-category.repo";
import { transactionStorage } from "src/infrastracture/database";
import { mapToEventCategoryEntity } from "./event-category.mapping";

@Injectable()
export class EventCategoryRepo implements IEventCategoryRepo {
  private get dbContext(): DatabaseTransactionConnection | DatabasePool {
    return transactionStorage.getStore() || this.pool;
  }

  constructor(
    @Inject(POSTGRES_POOL) private readonly pool: DatabasePool
  ) { }

  async getById(id: string): Promise<EventCategory | null> {
    const query = sql.unsafe`
      SELECT * FROM get_event_category_by_id(${id});
    `;

    const data = await this.dbContext.maybeOne(query);
    return data
      ? mapToEventCategoryEntity(data) :
      null;
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
}

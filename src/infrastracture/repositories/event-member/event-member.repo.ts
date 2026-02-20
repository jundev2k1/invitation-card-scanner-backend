import { PaginatedResult } from "@/src/application/common";
import { EventMemberDto } from "@/src/application/features/events/dtos";
import { POSTGRES_POOL } from "@/src/common/tokens";
import { IEventMemberRepo } from "@/src/domain/interfaces/repositories/event-member.repo";
import { Inject } from "@nestjs/common";
import { type DatabasePool, DatabaseTransactionConnection, sql } from "slonik";
import { transactionStorage } from "../../database";
import { mapToEventMemberSearchResult } from "./event-member.mapping";

export class EventMemberRepo implements IEventMemberRepo {
  private get dbContext(): DatabaseTransactionConnection | DatabasePool {
    return transactionStorage.getStore() || this.pool;
  }

  constructor(
    @Inject(POSTGRES_POOL) private readonly pool: DatabasePool
  ) { }

  async getMembersByEventId(eventId: string, keyword: string, page: number, pageSize: number)
    : Promise<PaginatedResult<EventMemberDto>> {
    const query = sql.unsafe`SELECT * FROM get_event_members_by_event_id(${eventId},${keyword})`;
    const result = await this.dbContext.query(query);
    return mapToEventMemberSearchResult(result.rows, page, pageSize);
  }

  async addMember(eventId: string, userId: string): Promise<void> {
    const query = sql.unsafe`SELECT add_event_member(${eventId},${userId})`;
    await this.dbContext.query(query);
  }

  async removeMember(memberId: string): Promise<void> {
    const query = sql.unsafe`SELECT remove_event_member(${memberId})`;
    await this.dbContext.query(query);
  }

  async removeAllMemberInEvent(eventId: string): Promise<void> {
    const query = sql.unsafe`SELECT remove_all_event_members_in_event(${eventId})`;
    await this.dbContext.query(query);
  }
}

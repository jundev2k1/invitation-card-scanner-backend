import { Role } from "@/src/domain/value-objects";
import { Inject, Injectable } from "@nestjs/common";
import type { DatabasePool, DatabaseTransactionConnection } from 'slonik';
import { sql } from 'slonik';
import { PaginatedResult } from "src/application/common";
import { UserSearchItem, UserSummaryDto } from "src/application/features/users/dtos";
import { POSTGRES_POOL } from "src/common/tokens";
import { User } from "src/domain/entities";
import { UserStatus } from "src/domain/enums";
import { IUserRepo } from "src/domain/interfaces/repositories/user.repo";
import { transactionStorage } from "src/infrastracture/database/unit-of-work/transaction-storage";
import { UUID } from "uuidv7";
import { mapToSearchResult, mapToUserEntity, mapToUserSummaries } from "./user.mapping";

@Injectable()
export class UserRepo implements IUserRepo {
  // Database context
  private get dbContext(): DatabaseTransactionConnection | DatabasePool {
    return transactionStorage.getStore() || this.pool;
  }

  constructor(
    @Inject(POSTGRES_POOL) private readonly pool: DatabasePool
  ) { }

  async search(
    keyword: string,
    statuses: UserStatus[],
    sortBy: string,
    sortOrder: string,
    page: number,
    pageSize: number
  ): Promise<PaginatedResult<UserSearchItem>> {
    const limit = (page - 1) * pageSize;
    const query = sql.unsafe`SELECT * FROM search_users_by_criteria(
      ${keyword.trim()},
      ${sql.array(statuses, 'int2')},
      ${sortBy},
      ${sortOrder},
      ${limit},
      ${pageSize})`;
    const data = await this.dbContext.query(query);
    return mapToSearchResult(data.rows, page, pageSize);
  }

  async getUserSuggestions(keyword: string, roles: Role[], pageSize: number): Promise<UserSummaryDto[]> {
    const query = sql.unsafe`SELECT * FROM search_users_suggestions(
      ${keyword},
      ${sql.array(roles.map(r => r.value), 'varchar')},
      ${pageSize}
    );`;
    const { rows } = await this.dbContext.query(query);
    return mapToUserSummaries(rows);
  }

  async getUserStatusCount(): Promise<[UserStatus, number][]> {
    const query = sql.unsafe`SELECT * FROM get_user_status_count();`;
    const data = await this.dbContext.query(query);
    return data.rows.map(i => [i.status, i.count]);
  }

  async getById(id: UUID): Promise<User | null> {
    const query = sql.unsafe`SELECT * FROM get_user_by_id(${id.toString()});`;
    const data = await this.dbContext.maybeOne(query);
    return data != null
      ? mapToUserEntity(data)
      : null;
  }

  async getByUsername(username: string): Promise<User | null> {
    const query = sql.unsafe`SELECT * FROM get_user_by_username(${username});`;
    const data = await this.dbContext.maybeOne(query);
    return data != null
      ? mapToUserEntity(data)
      : null;
  }

  async getByEmail(email: string): Promise<User | null> {
    const query = sql.unsafe`SELECT * FROM get_user_by_email(${email});`;
    const data = await this.dbContext.maybeOne(query);
    return data != null
      ? mapToUserEntity(data)
      : null;
  }

  async isExistUsername(username: string): Promise<boolean> {
    const query = sql.unsafe`SELECT check_user_exists_by_username(${username});`;
    return await this.dbContext.oneFirst(query);
  }

  async isExistEmail(email: string): Promise<boolean> {
    const query = sql.unsafe`SELECT check_user_exists_by_email(${email});`;
    return await this.dbContext.oneFirst(query);
  }

  async create(user: User): Promise<void> {
    const stored = sql.unsafe`SELECT create_user(
      ${user.id},
      ${user.username.value},
      ${user.email.value},
      ${user.nickName},
      ${user.phoneNumber.value},
      ${user.passwordHash},
      ${user.sex.value},
      ${user.bio},
      ${user.avatarUrl},
      ${user.status},
      ${user.role.value}
    );`;
    await this.dbContext.query(stored);
  }

  async update(user: User): Promise<void> {
    const stored = sql.unsafe`SELECT update_user(
      ${user.id},
      ${user.email.value},
      ${user.nickName},
      ${user.phoneNumber.value},
      ${user.passwordHash},
      ${user.sex.value},
      ${user.bio},
      ${user.avatarUrl},
      ${user.status}
    );`;
    await this.dbContext.query(stored);
  }
}

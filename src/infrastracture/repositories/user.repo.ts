import { Inject, Injectable } from "@nestjs/common";
import { sql } from 'slonik';
import type { DatabasePool } from 'slonik';
import { PaginatedResult } from "src/application/common";
import { POSTGRES_POOL } from "src/common/tokens";
import { User } from "src/domain/entities";
import { IUserRepo } from "src/domain/interfaces/repositories/user.repo";
import { mapToSearchResult, mapToUserEntity } from "./mapping/user.mapping";
import { UserSearchItem } from "src/application/features/users/dtos/user-search-item";

@Injectable()
export class UserRepo implements IUserRepo {
  constructor(
    @Inject(POSTGRES_POOL) private readonly pool: DatabasePool
  ) { }

  async search(keyword: string, page: number, pageSize: number): Promise<PaginatedResult<UserSearchItem>> {
    const limit = page * pageSize;
    const query = sql.unsafe`SELECT * FROM search_users_by_criteria(${keyword.trim()},${limit},${pageSize})`;
    const data = await this.pool.many(query);
    return mapToSearchResult(data, page, pageSize);
  }

  async getById(id: string): Promise<User | null> {
    const query = sql.unsafe`SELECT * FROM get_user_by_id(${id});`;
    const data = await this.pool.maybeOne(query);
    return data != null
      ? mapToUserEntity(data)
      : null;
  }

  async getByUsername(username: string): Promise<User | null> {
    const query = sql.unsafe`SELECT * FROM get_user_by_username(${username});`;
    const data = await this.pool.maybeOne(query);
    return data != null
      ? mapToUserEntity(data)
      : null;
  }

  async getByEmail(email: string): Promise<User | null> {
    const query = sql.unsafe`SELECT * FROM get_user_by_email(${email});`;
    const data = await this.pool.maybeOne(query);
    return data != null
      ? mapToUserEntity(data)
      : null;
  }

  async isExistUsername(username: string): Promise<boolean> {
    const query = sql.unsafe`SELECT * FROM check_user_exists_by_username(${username});`;
    return await this.pool.one(query);
  }

  async isExistEmail(email: string): Promise<boolean> {
    const query = sql.unsafe`SELECT * FROM check_user_exists_by_email(${email});`;
    return await this.pool.one(query);
  }

  async create(user: User): Promise<void> {
    const stored = sql.unsafe`SELECT create_user(
      ${user.id},
      ${user.username.value},
      ${user.email.value},
      ${user.nickName},
      ${user.phoneNumber.value},
      ${user.hashPassword},
      ${user.sex.value},
      ${user.bio},
      ${user.avatarUrl},
      ${user.status},
      ${user.role.value},
    );`;
    await this.pool.query(stored);
  }

  async update(user: User): Promise<void> {
    const stored = sql.unsafe`SELECT update_user(
      ${user.id},
      ${user.email.value},
      ${user.nickName},
      ${user.phoneNumber.value},
      ${user.hashPassword},
      ${user.sex.value},
      ${user.bio},
      ${user.avatarUrl},
      ${user.status},
    );`;
    await this.pool.query(stored);
  }
}

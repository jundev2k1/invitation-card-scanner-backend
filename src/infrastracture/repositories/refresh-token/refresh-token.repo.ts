import { Inject } from "@nestjs/common";
import { sql, type DatabasePool } from "slonik";
import { POSTGRES_POOL } from "src/common/tokens";
import { RefreshToken } from "src/domain/entities";
import { IRefreshTokenRepo } from "src/domain/interfaces/repositories/refresh-token.repo";
import { mapToRefreshTokenEntity } from "./refresh-token.mapping";

export class RefreshTokenRepo implements IRefreshTokenRepo {
  constructor(
    @Inject(POSTGRES_POOL) private readonly pool: DatabasePool
  ) { }

  async getsWithPagination(page: number, pageSize: number): Promise<RefreshToken[]> {
    const limit = (page - 1) * pageSize;
    const query = sql.unsafe`SELECT * FROM get_refresh_tokens_by_user_id_with_pagination(${limit},${pageSize});`;
    const data = await this.pool.query(query);
    return [...data.rows];
  }

  async getById(id: string): Promise<RefreshToken | null> {
    const query = sql.unsafe`SELECT * FROM get_refresh_token_by_id(${id});`;
    const data = await this.pool.maybeOne(query);
    return data != null
      ? mapToRefreshTokenEntity(data)
      : null;
  }

  async getByTokenHash(tokenHash: string): Promise<RefreshToken | null> {
    const query = sql.unsafe`SELECT * FROM get_refresh_token_by_token_hash(${tokenHash});`;
    const data = await this.pool.maybeOne(query);
    return data != null
      ? mapToRefreshTokenEntity(data)
      : null;
  }

  async create(refreshToken: RefreshToken): Promise<void> {
    const query = sql.unsafe`SELECT create_refresh_token(
      ${refreshToken.id},
      ${refreshToken.userId},
      ${refreshToken.tokenHash},
      ${refreshToken.jwtId},
      ${refreshToken.isRevoked},
      ${refreshToken.expiresAt.toISOString()},
      ${refreshToken.replacedByToken},
      ${refreshToken.ipAddress},
      ${refreshToken.userAgent},
      ${refreshToken.deviceName});`;
    await this.pool.query(query);
  }

  async replace(id: string, replacedByTokenId: string): Promise<void> {
    const query = sql.unsafe`SELECT replace_refresh_token(
      ${id},
      ${replacedByTokenId});`;
    await this.pool.query(query);
  }

  async revoke(id: string): Promise<void> {
    const query = sql.unsafe`SELECT revoke_refresh_token(${id});`;
    await this.pool.query(query);
  }

  async markAllExpiredAsRevoked(): Promise<void> {
    const query = sql.unsafe`SELECT mark_all_expired_refresh_tokens_as_revoked();`;
    await this.pool.query(query);
  }
}

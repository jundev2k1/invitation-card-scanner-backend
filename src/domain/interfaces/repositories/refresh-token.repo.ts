import { RefreshToken } from "src/domain/entities";

export interface IRefreshTokenRepo {
  getsWithPagination(page: number, pageSize: number): Promise<any[]>;

  getById(id: string): Promise<RefreshToken | null>;

  getByTokenHash(tokenHash: string): Promise<RefreshToken | null>;

  create(refreshToken: RefreshToken): Promise<void>;

  replace(id: string, replacedByTokenId: string): Promise<void>;

  revoke(id: string): Promise<void>;

  markAllExpiredAsRevoked(): Promise<void>;
}

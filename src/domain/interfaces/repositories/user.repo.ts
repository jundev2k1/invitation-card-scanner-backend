import { PaginatedResult } from "src/application/common";
import { UserSearchItem } from "src/application/features/users/dtos/user-search-item";
import { User } from "src/domain/entities";

export interface IUserRepo {
  search(keyword: string, page: number, pageSize: number): Promise<PaginatedResult<UserSearchItem>>;

  getById(id: string): Promise<User | null>;

  getByUsername(username: string): Promise<User | null>;

  getByEmail(email: string): Promise<User | null>;

  isExistUsername(username: string): Promise<boolean>;

  isExistEmail(email: string): Promise<boolean>;

  create(user: User): Promise<void>;

  update(user: User): Promise<void>;
}

import { PaginatedResult } from "src/application/common";
import { UserSearchItem } from "src/application/features/users/dtos";
import { User } from "src/domain/entities";
import { UserStatus } from "src/domain/enums";
import { UUID } from "uuidv7";

export interface IUserRepo {
  search(
    keyword: string,
    statuses: UserStatus[],
    sortBy: string,
    sortOrder: string,
    page: number,
    pageSize: number
  ): Promise<PaginatedResult<UserSearchItem>>;

  getById(id: UUID): Promise<User | null>;

  getUserStatusCount(): Promise<[UserStatus, number][]>;

  getByUsername(username: string): Promise<User | null>;

  getByEmail(email: string): Promise<User | null>;

  isExistUsername(username: string): Promise<boolean>;

  isExistEmail(email: string): Promise<boolean>;

  create(user: User): Promise<void>;

  update(user: User): Promise<void>;
}

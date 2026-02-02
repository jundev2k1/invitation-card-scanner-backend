import { PaginatedResult } from "src/application/common";
import { User } from "src/domain/entities";

export interface IUserRepo {
    search(): Promise<PaginatedResult<User>>;
    getById(id: string): Promise<User | null>;
    create(user: User): Promise<void>;
    update(user: User): Promise<void>;
}
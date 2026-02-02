import { Inject, Injectable } from "@nestjs/common";
import { sql } from 'slonik';
import type { DatabasePool } from 'slonik';
import { PaginatedResult } from "src/application/common";
import { POSTGRES_POOL } from "src/common/tokens";
import { User } from "src/domain/entities";
import { IUserRepo } from "src/domain/interfaces/repositories/user.repo";

@Injectable()
export class UserRepo implements IUserRepo {
    constructor(
        @Inject(POSTGRES_POOL) private readonly pool: DatabasePool
    ) { }

    async search(): Promise<PaginatedResult<User>> {
        return new PaginatedResult<User>([], 0, 1, 1, 20);
    }

    async getById(id: string): Promise<User | null> {
        return User.create({ name: 'test', email: 'test@g.c', hashPassword: 'password' });
    }

    async create(user: User): Promise<void> {

    }

    async update(user: User): Promise<void> {

    }
}

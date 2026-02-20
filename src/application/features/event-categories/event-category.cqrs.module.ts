import { DatabaseModule } from "@/src/infrastracture/database/database.module";
import { RepositoryModule } from "@/src/infrastracture/repositories/repository.module";
import { Module } from "@nestjs/common";
import { CreateCategoryHandler } from "./commands/create-category/create-category.handler";

const queries = [
];

const commands = [
  CreateCategoryHandler,
];

@Module({
  imports: [RepositoryModule, DatabaseModule],
  providers: [...queries, ...commands],
})
export class EventCategoryCqrsModule { }

import { DatabaseModule } from "@/src/infrastracture/database/database.module";
import { RepositoryModule } from "@/src/infrastracture/repositories/repository.module";
import { Module } from "@nestjs/common";
import { CreateCategoryHandler } from "./commands/create-category/create-category.handler";
import { DeleteCategoryHandler } from "./commands/delete-category/delete-category.handler";
import { UpdateCategoryHandler } from "./commands/update-category/update-category.handler";

const queries = [
];

const commands = [
  CreateCategoryHandler,
  UpdateCategoryHandler,
  DeleteCategoryHandler,
];

@Module({
  imports: [RepositoryModule, DatabaseModule],
  providers: [...queries, ...commands],
})
export class EventCategoryCqrsModule { }

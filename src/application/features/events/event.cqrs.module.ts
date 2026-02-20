import { DatabaseModule } from "@/src/infrastracture/database/database.module";
import { RepositoryModule } from "@/src/infrastracture/repositories/repository.module";
import { Module } from "@nestjs/common";
import { CreateEventHandler } from "./commands/create-event/create-event.handler";

const queries = [
];

const commands = [
  CreateEventHandler,
];

@Module({
  imports: [RepositoryModule, DatabaseModule],
  providers: [...queries, ...commands],
})
export class EventCqrsModule { }

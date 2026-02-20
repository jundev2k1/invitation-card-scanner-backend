import { DatabaseModule } from "@/src/infrastracture/database/database.module";
import { RepositoryModule } from "@/src/infrastracture/repositories/repository.module";
import { Module } from "@nestjs/common";
import { CreateEventHandler } from "./commands/create-event/create-event.handler";
import { DeleteEventHandler } from "./commands/delete-event/delete-event.handler";
import { UpdateEventHandler } from "./commands/update-event/update-event.handler";

const queries = [
];

const commands = [
  CreateEventHandler,
  UpdateEventHandler,
  DeleteEventHandler,
];

@Module({
  imports: [RepositoryModule, DatabaseModule],
  providers: [...queries, ...commands],
})
export class EventCqrsModule { }

import { DatabaseModule } from "@/src/infrastracture/database/database.module";
import { RepositoryModule } from "@/src/infrastracture/repositories/repository.module";
import { Module } from "@nestjs/common";
import { CreateEventHandler } from "./commands/create-event/create-event.handler";
import { DeleteEventHandler } from "./commands/delete-event/delete-event.handler";
import { UpdateEventStatusHandler } from "./commands/update-event-status/update-event-status.handler";
import { UpdateEventHandler } from "./commands/update-event/update-event.handler";
import { GetEventDetailHandler } from "./queries/get-detail/get-detail.handler";
import { SearchEventHandler } from "./queries/search/search.handler";

const queries = [
  SearchEventHandler,
  GetEventDetailHandler,
];

const commands = [
  CreateEventHandler,
  UpdateEventHandler,
  UpdateEventStatusHandler,
  DeleteEventHandler,
];

@Module({
  imports: [RepositoryModule, DatabaseModule],
  providers: [...queries, ...commands],
})
export class EventCqrsModule { }

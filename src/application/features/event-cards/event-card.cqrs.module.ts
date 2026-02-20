import { DatabaseModule } from "@/src/infrastracture/database/database.module";
import { RepositoryModule } from "@/src/infrastracture/repositories/repository.module";
import { Module } from "@nestjs/common";
import { CreateEventCardHandler } from "./commands/create-card/create-card.handler";
import { DeleteEventCardHandler } from "./commands/delete-card/delete-card.handler";
import { UpdateEventCardHandler } from "./commands/update-card/update-card.handler";

const queries = [
];

const commands = [
  CreateEventCardHandler,
  UpdateEventCardHandler,
  DeleteEventCardHandler,
];

@Module({
  imports: [RepositoryModule, DatabaseModule],
  providers: [...queries, ...commands],
})
export class EventCardCqrsModule { }

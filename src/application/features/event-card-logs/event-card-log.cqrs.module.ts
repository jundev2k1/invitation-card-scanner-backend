import { DatabaseModule } from "@/src/infrastracture/database/database.module";
import { RepositoryModule } from "@/src/infrastracture/repositories/repository.module";
import { Module } from "@nestjs/common";
import { ScanCardHandler } from "./commands/scan-card/scan-card.handler";

const queries = [
];

const commands = [
  ScanCardHandler,
];

@Module({
  imports: [RepositoryModule, DatabaseModule],
  providers: [...queries, ...commands],
})
export class EventCardLogCqrsModule { }

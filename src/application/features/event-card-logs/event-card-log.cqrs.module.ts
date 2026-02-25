import { DatabaseModule } from "@/src/infrastracture/database/database.module";
import { RepositoryModule } from "@/src/infrastracture/repositories/repository.module";
import { SecurityModule } from "@/src/infrastracture/security/security.module";
import { Module } from "@nestjs/common";
import { ScanCardHandler } from "./commands/scan-card/scan-card.handler";

const queries = [
];

const commands = [
  ScanCardHandler,
];

@Module({
  imports: [RepositoryModule, DatabaseModule, SecurityModule],
  providers: [...queries, ...commands],
})
export class EventCardLogCqrsModule { }

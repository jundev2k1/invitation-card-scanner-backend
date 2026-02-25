import { DatabaseModule } from "@/src/infrastracture/database/database.module";
import { RepositoryModule } from "@/src/infrastracture/repositories/repository.module";
import { SecurityModule } from "@/src/infrastracture/security/security.module";
import { Module } from "@nestjs/common";
import { CheckInCardHandler } from "./commands/check-in/check-in.handler";

const queries = [
];

const commands = [
  CheckInCardHandler,
];

@Module({
  imports: [RepositoryModule, DatabaseModule, SecurityModule],
  providers: [...queries, ...commands],
})
export class EventCardLogCqrsModule { }

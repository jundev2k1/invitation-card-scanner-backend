import { DatabaseModule } from "@/src/infrastracture/database/database.module";
import { RepositoryModule } from "@/src/infrastracture/repositories/repository.module";
import { Module } from "@nestjs/common";
import { AssignMemberHandler } from "./commands/assign-member/assign-member.handler";
import { RemoveMemberHandler } from "./commands/remove-member/remove-member.handler";
import { UpdateMemberInfoHandler } from "./commands/update-info/update-info.handler";
import { SearchMemberByEventIdHandler } from "./queries/search-members-by-event-id/search-members-by-event-id.handler";

const queries = [
  SearchMemberByEventIdHandler,
];

const commands = [
  AssignMemberHandler,
  UpdateMemberInfoHandler,
  RemoveMemberHandler,
];

@Module({
  imports: [RepositoryModule, DatabaseModule],
  providers: [...queries, ...commands],
})
export class EventMemberCqrsModule { }

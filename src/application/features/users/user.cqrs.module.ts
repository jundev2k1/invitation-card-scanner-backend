import { Module } from "@nestjs/common";
import { RepositoryModule } from "src/infrastracture/repositories/repository.module";
import { ApproveUserHandler } from "./commands/approve-user/approve-user.handler";
import { UpdateUserHandler } from "./commands/update-user/update-user.handler";
import { GetUserDetailHandler } from "./queries/get-user-detail/get-user-detail.handler";
import { GetUserListHandler } from "./queries/get-user-list/get-user-list.handler";
import { GetUserStatusCountHandler } from "./queries/get-user-status-count/get-status-count.handler";

const queries = [
  GetUserListHandler,
  GetUserDetailHandler,
  GetUserStatusCountHandler,
];
const commands = [
  ApproveUserHandler,
  UpdateUserHandler,
];

@Module({
  imports: [RepositoryModule],
  providers: [...queries, ...commands],
})
export class UserCqrsModule { }

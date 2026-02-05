import { Module } from "@nestjs/common";
import { RepositoryModule } from "src/infrastracture/repositories/repository.module";
import { ApproveUserHandler } from "./commands/approve-user/approve-user.handler";

const queries = [];
const commands = [
  ApproveUserHandler
];

@Module({
  imports: [RepositoryModule],
  providers: [...queries, ...commands],
})
export class UserCqrsModule { }

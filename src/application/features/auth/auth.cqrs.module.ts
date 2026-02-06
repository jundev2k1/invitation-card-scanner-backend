import { Module } from "@nestjs/common";
import { AuthModule } from "src/infrastracture/auth";
import { DatabaseModule } from "src/infrastracture/database/database.module";
import { RepositoryModule } from "src/infrastracture/repositories/repository.module";
import { SecurityModule } from "src/infrastracture/security/security.module";
import { LoginHandler } from "./commands/login/login.handler";
import { RefreshTokenHandler } from "./commands/refresh-token/refresh-token.handler";
import { RegisterHandler } from "./commands/register/register.handler";

const queries = [];
const commands = [
  LoginHandler,
  RegisterHandler,
  RefreshTokenHandler,
];


@Module({
  imports: [AuthModule, RepositoryModule, SecurityModule, DatabaseModule],
  providers: [...queries, ...commands],
})
export class AuthCqrsModule { }

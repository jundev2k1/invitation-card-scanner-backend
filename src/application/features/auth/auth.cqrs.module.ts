import { Module } from "@nestjs/common";
import { AuthModule } from "src/infrastracture/auth/auth.module";
import { RepositoryModule } from "src/infrastracture/repositories/repository.module";
import { SecurityModule } from "src/infrastracture/security/security.module";
import { LoginHandler } from "./commands/login/login.handler";
import { RegisterHandler } from "./commands/register/register.handler";

const providers = [
  LoginHandler,
  RegisterHandler,
];

@Module({
  imports: [AuthModule, RepositoryModule, SecurityModule],
  providers: providers,
})
export class AuthCqrsModule { }

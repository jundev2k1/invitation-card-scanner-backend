import { Module } from "@nestjs/common";
import { LoginHandler } from "./commands/login/login.handler";
import { AuthModule } from "src/infrastracture/auth/auth.module";

const providers = [
  LoginHandler
];

@Module({
  imports: [AuthModule],
  providers: providers,
})
export class AuthCqrsModule { }

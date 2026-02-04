import { Module } from "@nestjs/common";
import { AuthCqrsModule } from "./auth/auth.cqrs.module";

const providers = [
  AuthCqrsModule
];

@Module({
  imports: providers,
  exports: providers
})
export class CqrsModule { }

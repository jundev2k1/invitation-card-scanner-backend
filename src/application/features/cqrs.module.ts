import { Module } from "@nestjs/common";
import { AuthCqrsModule } from "./auth/auth.cqrs.module";
import { EventCategoryCqrsModule } from "./event-categories/event-category.cqrs.module";
import { EventCqrsModule } from "./events/event.cqrs.module";
import { UserCqrsModule } from "./users/user.cqrs.module";

const providers = [
  AuthCqrsModule,
  UserCqrsModule,
  EventCategoryCqrsModule,
  EventCqrsModule,
];

@Module({
  imports: providers,
  exports: providers,
})
export class CqrsModule { }

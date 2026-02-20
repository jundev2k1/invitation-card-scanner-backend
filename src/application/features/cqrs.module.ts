import { Module } from "@nestjs/common";
import { AuthCqrsModule } from "./auth/auth.cqrs.module";
import { EventCardCqrsModule } from "./event-cards/event-card.cqrs.module";
import { EventCategoryCqrsModule } from "./event-categories/event-category.cqrs.module";
import { EventCqrsModule } from "./events/event.cqrs.module";
import { UserCqrsModule } from "./users/user.cqrs.module";

const providers = [
  AuthCqrsModule,
  UserCqrsModule,
  EventCategoryCqrsModule,
  EventCqrsModule,
  EventCardCqrsModule,
];

@Module({
  imports: providers,
  exports: providers,
})
export class CqrsModule { }
